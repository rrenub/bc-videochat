const interventionsRouter = require('express').Router();
const interventionService = require('../models/interventions')
const blockchainService = require('../models/blockchain')
const schedule = require('node-schedule');
const Queue = require('bull');
const constants = require('../utils/constants')

//Cola para hacer el token (ver donde poner)
const workQueue = new Queue('work', constants.REDIS_URL);

//Tarea de cálculo de hash completada
workQueue.on('global:completed', async (job, result) => {
    const {interventionID, interventionToken} = JSON.parse(result)

    //Se envía el token a la blockchain
    blockchainService.addToBlockchain(interventionID, interventionToken)
})

/**
 * Ruta: /interventions/validate
 * Descripción: Realiza la validación de un usuario a una intervención
 */
interventionsRouter.post('/validate', async (req, res) => {
    const {interventions, state} = req.body

    const auth = req.currentUser;

    if(auth) {
        await interventionService.validateIntervention(interventions, auth.email, state)
        await checkValidation(interventions)
        return res.send('Intervention validated')
    }
    
    return res.status(403).send('Not authorized')
})

/**
 * Comprueba y actualiza el estado de la intevención
 * @param {intervention[]} interventions - Array con las intervenciones a validar (ID y meetingID)
 */
const checkValidation = async (interventions) => {

    interventions.forEach(async (intervention) => {
        const {ID, meetingID} = intervention

        const interventionInfo = await interventionService.getIntervention(ID)
        
        const totalValidators = interventionInfo.denied.length
                                    + interventionInfo.accepted.length
                                    + interventionInfo.pending.length

        //Condición si la intervención ha sido denegada
        const isInterventionDenied = (
            interventionInfo.denied.length > (totalValidators - interventionInfo.validationsNeeded)
        )
        
        //Condición si la intervención ha sido aceptada
        const isInterventionAccepted = (
            interventionInfo.accepted.length >= interventionInfo.validationsNeeded
        )

        if(interventionInfo.state === 'PENDING') {
            if(isInterventionDenied) {
                await interventionService.updateInterventionState(intervention.ID, 'DENIED')

            } else if (isInterventionAccepted) {
                //Cancela el trabajo programado una vez que la intervención ha sido validada
                try {
                    let validateJob = schedule.scheduledJobs[ID];
                    validateJob.cancel();
                } catch (error) {
                    console.log(error)
                }

                //Actualiza su estado y se genera su token par añadir a la blockchain
                await interventionService.updateInterventionState(intervention.ID, 'ACCEPTED')
                await createBlockchainToken(interventionInfo.url, meetingID, intervention.ID)
            } else {
                console.log(`Intervention ${intervention.ID} is still PENDING for validation`)
            }
        }
    })
}

/**
 * Inicia el proceso para añadir generar y añadir el token a la blockchain.
 * Crea una tarea en segundo plano para generar el token del audio de la intervención
 * @param {String} url - URL del contenido multimedia
 * @param {String} meetingID - ID de la reunión
 * @param {String} interventionID - ID de la intervención
 */
const createBlockchainToken = async (url, meetingID, interventionID) => {
    await workQueue.add({
        url: url,
        meetingID: meetingID,
        interventionID: interventionID
    });

    console.log(`Creating token for intervention ${interventionID}...`)
}

/**
 * Ruta: /interventions/pending
 * Descripción: Devuelve una lista de las intervenciones pendientes de validación
 */
interventionsRouter.post('/pending', async (req, res) => {
    const auth = req.currentUser;

    if(auth) {
        try {
            const data = await interventionService.getPendingInterventions(auth.email)
            return res.status(200).send(data)

        } catch(error) {
            console.log(error)
            return res.status(500).send('Error fetching pending interventions from database')
        }
    }
    return res.status(403).send('Not authorized')
})

/**
 * Ruta: /interventions
 * Descripción: Devuelve una lista de las intervenciones realizadas en una reunión
 */
interventionsRouter.post('/', async (req, res) => {
    const { meetingID } = req.body; 

    const auth = req.currentUser;

    if(auth) {
        try {
            const data = await interventionService.getInterventions(meetingID, auth.email)
            return res.status(200).send(data)
            
        } catch(error) {
            console.log(error)
            return res.status(404).send('Error fetching pending interventions from database')
        }
    }
    return res.status(403).send('Not authorized')
})

/**
 * Ruta: /interventions/validated
 * Descripción: Devuelve una lista de las intervenciones validadas de una reunión
 */
 interventionsRouter.post('/validated', async (req, res) => {
    const { meetingID } = req.body; 

    const auth = req.currentUser;

    if(auth) {
        const data = await interventionService.getValidatedInterventions(meetingID)
        return res.send(data)
    }
    return res.status(403).send('Not authorized')
})


/**
 * Ruta: /interventions/new_intervention
 * Descripción: Crea una nueva intervención con sus respectivas validaciones pendientes
 */
interventionsRouter.post('/new_intervention', async (req, res) => {
    const auth = req.currentUser;

    if(auth) {
        await interventionService.createIntervention(req.body, auth.email)

        //Crea tarea de comprobar validación en un tiempo determinado (desistimiento positivo)
        scheduleJobToValidate(req.body.interventionID);

        return res.send('Intervention saved awaiting for validation')
    }
    return res.status(403).send('Not authorized')
})

/**
 * Ruta: /interventions/intervention
 * Descripción: Consulta la información de una intervención concreta
 */
interventionsRouter.post('/intervention', async (req, res) => {
    const { interventionID } = req.body; 
    const auth = req.currentUser;

    if(auth) {
        try {
            const data = await interventionService.getIntervention(interventionID)
            const isParticipant = await interventionService.isUserParticipant(data.meetingID, auth.email)
            
            if(isParticipant) {
                return res.send(data)
            }
        } catch(error) {
            return res.status(404).send('Intervention not found in server')
        }
    }
    return res.status(403).send('Not authorized')
})


/**
 * Crea una tarea en segundo plano que se ejecuta un tiempo determinado después
 * de una intervención, para validar en caso de desistimiento positivo
 * 
 * @param {String} - ID de la intervención
 */
const scheduleJobToValidate = (jobID) => {
    console.log('creando tarea secundaria', jobID)
    
    //Se crea la fecha en la que se debe ejecutar la tarea
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + constants.DAYS_BEFORE_VALIDATION_WITHDRAWAL)

    //Se crea el trabajo programado y la operación que debe realizar
    schedule.scheduleJob(jobID, endDate, () => {
        console.log('Intervención a validar por desistimiento positivo', jobID);
        interventionService.updateInterventionState(jobID, 'ACCEPTED')
    });
}


    //var date = new Date(endDate.getTime() + 1*60000);

module.exports = interventionsRouter
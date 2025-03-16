const schedule = require('node-schedule');
const Queue = require('bull');
const constants = require('../utils/constants')

const interventionsRouter = require('express').Router();
const interventionService = require('../models/interventions')
const blockchainService = require('../models/blockchain')
const authMiddleware = require('../middleware/authMiddleware')

interventionsRouter.use(authMiddleware)

// Queue for processing interventions and generating hash for blockchain
const workQueue = new Queue('work', constants.REDIS_URL);

// On job completion, upload hash to blockchain
workQueue.on('global:completed', async (job, result) => {
    const { interventionID, interventionToken } = JSON.parse(result);
    blockchainService.addToBlockchain(interventionID, interventionToken);
});

/**
 * @route POST /interventions/validate
 * @description Validates a user's intervention
 */
interventionsRouter.post('/validate', async (req, res) => {
    const { interventions, state } = req.body;

    await interventionService.validateIntervention(interventions, req.auth.email, state);
    await checkValidation(interventions);

    return res.send('Intervention validated');
});

/**
 * Checks and updates the status of an intervention
 * @param {Object[]} interventions - Array of interventions to validate (ID and meetingID)
 */
const checkValidation = async (interventions) => {
    interventions.forEach(async (intervention) => {
        const { ID, meetingID } = intervention;
        const interventionInfo = await interventionService.getIntervention(ID);
        
        const totalValidators = interventionInfo.denied.length
                                    + interventionInfo.accepted.length
                                    + interventionInfo.pending.length;

        // Condition if the intervention has been denied
        const isInterventionDenied = (
            interventionInfo.denied.length > (totalValidators - interventionInfo.validationsNeeded)
        );
        
        // Condition if the intervention has been accepted
        const isInterventionAccepted = (
            interventionInfo.accepted.length >= interventionInfo.validationsNeeded
        );

        if (interventionInfo.state === 'PENDING') {
            if (isInterventionDenied) {
                await interventionService.updateInterventionState(intervention.ID, 'DENIED');
            } else if (isInterventionAccepted) {
                // Cancel the scheduled job once the intervention has been validated
                try {
                    let validateJob = schedule.scheduledJobs[ID];
                    validateJob.cancel();
                } catch (error) {
                    console.log(error);
                }

                // Update its state and generate its token to add to the blockchain
                await interventionService.updateInterventionState(intervention.ID, 'ACCEPTED');
                await createBlockchainToken(interventionInfo.url, meetingID, intervention.ID);
            } else {
                console.log(`Intervention ${intervention.ID} is still PENDING for validation`);
            }
        }
    });
};

/**
 * Starts the process of generating and adding the token to the blockchain.
 * Creates a background task to generate the intervention's audio token.
 * @param {String} url - URL of the multimedia content
 * @param {String} meetingID - ID of the meeting
 * @param {String} interventionID - ID of the intervention
 */
const createBlockchainToken = async (url, meetingID, interventionID) => {
    await workQueue.add({
        url: url,
        meetingID: meetingID,
        interventionID: interventionID
    });

    console.log(`Creating token for intervention ${interventionID}...`);
};

/**
 * @route GET /interventions/pending
 * @description Returns a list of pending interventions for validation
 */
interventionsRouter.get('/pending', async (req, res) => {
    try {
        const data = await interventionService.getPendingInterventions(req.auth.email);
        return res.status(200).send(data);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Error fetching pending interventions from database');
    }
});

/**
 * @route GET /interventions
 * @description Returns a list of interventions for a meeting
 */
interventionsRouter.get('/', async (req, res) => {
    const { meetingID } = req.body; 

    try {
        const data = await interventionService.getInterventions(meetingID, req.auth.email);
        return res.status(200).send(data);
    } catch (error) {
        console.log(error);
        return res.status(404).send('Error fetching interventions from database');
    }
});

/**
 * @route GET /interventions/validated
 * @description Returns a list of validated interventions for a meeting
 */
interventionsRouter.get('/validated', async (req, res) => {
    const { meetingID } = req.body; 
    const data = await interventionService.getValidatedInterventions(meetingID);
    return res.send(data);
});

/**
 * @route POST /interventions/new_intervention
 * @description Creates a new intervention with pending validations
 */
interventionsRouter.post('/new_intervention', async (req, res) => {
    await interventionService.createIntervention(req.body, req.auth.email);
    scheduleJobToValidate(req.body.interventionID);
    return res.send('Intervention saved awaiting validation');
});

/**
 * @route GET /interventions/intervention
 * @description Retrieves information about a specific intervention
 */
interventionsRouter.get('/intervention', async (req, res) => {
    const { interventionID } = req.body; 

    try {
        const data = await interventionService.getIntervention(interventionID);
        const isParticipant = await interventionService.isUserParticipant(data.meetingID, req.auth.email);
        
        if (isParticipant) {
            return res.send(data);
        } else {
            return res.status(403).send('You are not a meeting participant');
        }
    } catch (error) {
        return res.status(404).send('Intervention not found on the server');
    }
});

/**
 * Creates a background task that runs after a specified time
 * following an intervention to validate it in case of withdrawal.
 * @param {String} jobID - Intervention ID
 */
const scheduleJobToValidate = (jobID) => {
    console.log('Creating background task', jobID);
    
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + constants.DAYS_BEFORE_VALIDATION_WITHDRAWAL);

    schedule.scheduleJob(jobID, endDate, () => {
        console.log('Intervention automatically validated due to withdrawal', jobID);
        interventionService.updateInterventionState(jobID, 'ACCEPTED');
    });
};

module.exports = interventionsRouter;
const firebaseAdmin = require('../utils/firebaseAdmin')

const db = firebaseAdmin.db;

/**
 * Crea la intervención recibida en Firestore
 * @param {Intervention} intervention - Datos de la intervención
 */
const createIntervention = async (interventionInfo, author) => {
    const {meetingID, interventionID, name, url} = interventionInfo
    
    const meetingInfo = await getMeetingInfo(meetingID);

    const pendingValidators = meetingInfo.validator === 'none' 
        ? meetingInfo.participants
        : [meetingInfo.validator]

        const validationsNeeded = (meetingInfo.validator === 'none')
            ? Math.ceil(meetingInfo.participants.length * (meetingInfo.percentage / 100))
            : 1;
            
    await db.collection('meetings')
            .doc(meetingID)
            .collection('interventions')
            .doc(interventionID).set({
                ID: interventionID,
                author: author,
                meetingID: meetingID,
                name: name,
                date: new Date(),
                url: url,
                pending: pendingValidators,
                accepted: [],
                denied: [],
                validationsNeeded: validationsNeeded,
                state: 'PENDING'
            })
}


/**
 * Consulta a Firestore las intervenciones pendientes de validación 
 * @param {String} user - Email del usuario
 * @return {intervention[]} intervenciones pendientes
 */
const getPendingInterventions = async (user) => {
    let interventions = []; 

    const querySnapshot = await db.collectionGroup('interventions')
                                    .where('pending', 'array-contains', user)
                                    .where('state','==', 'PENDING')
                                    .get()

    querySnapshot.forEach((doc) => {
        interventions.push(doc.data())
    });

    return interventions;
}

/**
 * Consulta a Firestore las intervenciones realizadas por un usuario en una reunión
 * @param {String} meetingID ID de la reunión
 * @return {intervention[]} Lista de intervenciones realizadas por un usuario en una reunión
 */
const getInterventions = async (meetingID, user) => {
    let interventions = []; 

    const querySnapshot = await db.collection('meetings')
                                    .doc(meetingID)
                                    .collection('interventions')
                                    .where('author', '==', user)
                                    .get()

    querySnapshot.forEach((doc) => {
        interventions.push(doc.data())
    });

    return interventions;
}

/**
 * Consulta a Firestore las intervenciones validadas en una reunión
 * @param {String} meetingID ID de la reunión
 * @return {interventions} Lista de intervenciones validadas de una reunión
 */
 const getValidatedInterventions = async (meetingID) => {
    let interventions = []; 

    const querySnapshot = await db.collection('meetings')
                                    .doc(meetingID)
                                    .collection('interventions')
                                    .where('state', '==', 'ACCEPTED')
                                    .get()

    querySnapshot.forEach((doc) => {
        interventions.push(doc.data())
    });

    return interventions;
}

/**
 * Realiza el proceso de validación para la lista de intervenciones a validar
 * @param {[interventions]} interventions - Intervenciones a validar
 * @param {String} user - Email del usuario
 * @param {String} state - Estado a validar (ACCEPTED ó DENIED)
 */
const validateIntervention = async (interventions, user, state) => {
    const batch = db.batch();

    interventions.forEach(async (intervention) => {
        console.log('Validando intervention ', intervention.ID, ' de la reunion ', intervention.meetingID, user)
        const interventionRef = db.doc(`meetings/${intervention.meetingID}/interventions/${intervention.ID}`)

        if(state === 'ACCEPTED') {
            batch.update(interventionRef,
                {
                    'pending': firebaseAdmin.admin.firestore.FieldValue.arrayRemove(user),
                    'accepted': firebaseAdmin.admin.firestore.FieldValue.arrayUnion(user)
                }
            )
        } else {
            batch.update(interventionRef,
                {
                    'pending': firebaseAdmin.admin.firestore.FieldValue.arrayRemove(user),
                    'denied': firebaseAdmin.admin.firestore.FieldValue.arrayUnion(user)
                }
            )
        }
    })
    await batch.commit();
}


/**
 * Consulta a Firestore la información de una intervención concreta
 * @param {String} interventionID - ID de la intervención
 * @param {String} meetingID - ID de la reunión
 * @return {intervention} La información de la intervención
*/
const getIntervention = async (interventionID, meetingID) => {
    let intervention = null;

    const interventionSnapshot = await db.collectionGroup('interventions')
                                    .where('ID', '==', interventionID)
                                    .get()

    if(interventionSnapshot.empty) {
        throw new Error('intervention not found')
    }

    interventionSnapshot.docs.forEach(snapshot => {
        intervention = snapshot.data()
    })

    console.log('intervention found', intervention)

    return intervention;
}

/**
 * Actualiza en Firestore el estado de una intervención
 * @param {String} interventionID - ID de la intervención
 * @param {String} meetingID - ID de la reunión
 * @param {String} state - Estado a actualizar
 */
const updateInterventionState = async (interventionID, state) => {
    console.log(`!!!! Intervention ${interventionID} has been ${state} ===`)

    const interventionSnapshot = await db.collectionGroup('interventions')
                                    .where('ID', '==', interventionID)
                                    .get()

    interventionSnapshot.docs.forEach(snapshot => {
        snapshot.ref.update({state: state})
    })
}

/**
 * Consulta en Firestore la información de una reunión
 * @param {String} meetingID - ID de la reunión
 * @return {meeting} La información de la reunión
 */
const getMeetingInfo = async (meetingID) => {
    const meetingDoc = await db.collection('meetings').doc(meetingID).get()
    return meetingDoc.data()
}

/**
 * Comprueba si un usuario ha sido invitado a la reunión
 * @param {String} meetingID - ID de la reunión
 * @param {String} user - Email del usuario
 * @return {Boolean} Si el usuario ha sido invitado o no
 */
const isUserParticipant = async (meetingID, user) => {
    const meetingDoc = await db.collection('meetings').doc(meetingID).get()
    console.log('checking if user is particpant', meetingDoc.data().participants)

    return meetingDoc.data().participants.includes(user)
}

module.exports = {
    createIntervention,
    getPendingInterventions,
    getInterventions,
    validateIntervention,
    getIntervention,
    updateInterventionState,
    getValidatedInterventions,
    isUserParticipant
}
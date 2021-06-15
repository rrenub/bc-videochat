const firebaseAdmin = require('../utils/firebaseAdmin')
const constants = require('../utils/constants')
const randomstring = require("randomstring");
const { v4: uuidv4 } = require('uuid');
const Queue = require('bull');

const emailQueue = new Queue('sendemail', constants.REDIS_URL);

//Referencia a la colección en Firestore
const meetingsRef = firebaseAdmin.db.collection('meetings');

/**
 * Consulta a Firestore la lista de reuniones a las que ha sido invitado un usuario
 * @param {String} user - Email del usuario
 * @return {meetings} Lista de reuniones
 */
const getAllMeetings = async (user) => {
    let meetings = [];

    const snapshot = await meetingsRef.where('participants', 'array-contains', user)
                                            .orderBy('endDate', 'desc')
                                            .get();
    snapshot.forEach((doc) => {
        meetings.push(doc.data())
    });

    return meetings;
}

/**
 * Consulta a Firestore la lista de reuniones a las que ha sido invitado un usuario
 * que aún no han expirado (Fecha de finalización)
 * @param {String} user - Email del usuario
 * @return {meetings} Lista de reuniones sin expirar
 */
const getNextMeetings = async (user) => {
    let meetings = [];

    const snapshot = await meetingsRef.where('participants', 'array-contains', user)
                                            .where('endDate', '>', new Date())
                                            .orderBy('endDate', 'desc')
                                            .get();
    snapshot.forEach((doc) => {
        meetings.push(doc.data())
    });

    return meetings;
}

/**
 * Crea en Firestore una reunión
 * @param {meeting} meetingInfo - Información de la reunión a crear
 */
const createMeeting = async (meetingInfo) => {
    const {name, percentage, participants, validator, startDate, endDate} = meetingInfo
    const meetingId = uuidv4();
    const accessToken = randomstring.generate(10);

    const meetingRef = meetingsRef.doc(meetingId);
    
    await meetingRef.set({
        name: name,
        percentage: percentage,
        participants: participants,
        meetingId: meetingId,
        accessToken: accessToken,
        validator: validator,
        startDate: firebaseAdmin.admin.firestore.Timestamp.fromDate(new Date(startDate)),
        endDate: firebaseAdmin.admin.firestore.Timestamp.fromDate(new Date(endDate))
    })

    sendEmailMeeting(name, participants, meetingId, startDate, endDate)
}

/**
 * Envía un email con el enlace de acceso a la reunión a la lista de usuarios indicada
 * @param {String} meeting - Nombre de la reunión
 * @param {String[]} particpants - Lista de correo electronicos de los participantes
 * @param {String} meetingID - ID de la reunión
 */
const sendEmailMeeting = async (meeting, participants, meetingID, startDate, endDate) => {
    const start = new Date(startDate).toLocaleTimeString()
    const end = new Date(endDate).toLocaleTimeString()

    await emailQueue.add({
        subject: `Ha sido invitado a la reunión: ${meeting} entre la fecha ${start} y ${end}`,
        text: `https://bc-videochat.herokuapp.com/meetings/${meetingID}`,
        users: participants
    })
}

/**
 * Consulta a Firebase la información de una reunión
 * @param id - ID de la reunión
 */
const getMeeting = async (id) => {
    const doc = await meetingsRef.doc(id).get();

    if (!doc.exists) {
        console.log('Not found');
        return null

      } else {
        console.log('Meeting data:', doc.data());
        return doc.data()
      }
}

/**
 * Se comprueba si el token de acceso a la reunión es válido
 * @param {String} meetingID - ID de la reunión
 * @param {String} meetingToken - Token de acceso a la reunión
 */
const isAuthorized = async (meetingID, meetingToken) => {
    const doc = await meetingsRef.doc(meetingID).get();

    return doc.data().accessToken === meetingToken
}


module.exports = {
    getAllMeetings,
    getNextMeetings,
    createMeeting,
    isAuthorized,
    getMeeting
}
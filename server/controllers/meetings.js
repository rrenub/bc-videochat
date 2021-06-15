const meetingsRouter = require('express').Router();
const meetingService = require('../models/meetings')

/**
 * Ruta: /meetings
 * Descripción: Devuelve una lista de las reuniones a las que está invitado el usuario
 */
meetingsRouter.post('/', async (req, res) => {
    const auth = req.currentUser;

    if(auth) {
        const meetings = await meetingService.getAllMeetings(auth.email)
        return res.send(meetings)
    }
    return res.status(403).send('Not authorized')
})

/**
 * Ruta: /meetings/next-meetings
 * Descripción: Devuelve una lista de las reuniones a las que está invitado el usuario
 */
 meetingsRouter.post('/next_meetings', async (req, res) => {
    const auth = req.currentUser;
    
    if(auth) {
        console.log(auth)
        const nextMeetings = await meetingService.getNextMeetings(auth.email)
        return res.send(nextMeetings)
    }
    return res.status(403).send('Not authorized')
})

/**
 * Ruta: /meetings/create-meeting
 * Descripción: Crea una reunión
 */
meetingsRouter.post('/create-meeting', async (req, res) => {
    const auth = req.currentUser;

    if(auth) {
        if(auth.admin) {
            await meetingService.createMeeting(req.body)
            return res.send('meeting created')
        }
    }
    return res.status(403).send('Not authorized')
})


/**
 * Ruta: /meetings/access-meeting
 * Descripción: Comprueba si el usuario tiene acceso a una reunión
 */
 meetingsRouter.post('/access-meeting', async (req, res) => {
    const  { meetingID } = req.body
    const auth = req.currentUser;

    if(auth) {
        console.log(req.body)
        const meeting = await meetingService.getMeeting(meetingID)

        if(meeting) {
            if(meeting.participants.includes(auth.email)) {
                return res.send(meeting.accessToken)
            } else {
                return res.status(403).send('Not authorized')
            }
        }
        return res.status(404).send('Meeting not found')
    }
    return res.status(403).send('Not authorized')
})


/**
 * Ruta: /meetings/id
 * Descripción: Devuelve la información de una reunión dado su ID
 */
meetingsRouter.post('/id', async (req, res) => {
    const { meetingID } = req.body
    const auth = req.currentUser;
    
    if(auth) {
        const meeting = await meetingService.getMeeting(meetingID)

        if(meeting) {
            if(meeting.participants.includes(auth.email)) {
                return res.send(meeting)
            } else {
                return res.status(403).send('Not authorized')
            }
        }
        return res.status(404).send('Meeting not found')
    }
    return res.status(403).send('Not authorized')
})

module.exports = meetingsRouter
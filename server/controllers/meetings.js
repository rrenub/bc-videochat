const meetingsRouter = require('express').Router();
const meetingService = require('../models/meetings');
const authMiddleware = require('../middleware/authMiddleware')

meetingsRouter.use(authMiddleware);

/**
 * @route GET /meetings
 * @desc Returns a list of meetings the user is invited to
 * @access Private
 */
meetingsRouter.get('/', async (req, res) => {
    const meetings = await meetingService.getAllMeetings(auth.email);
    return res.send(meetings);
});

/**
 * @route GET /meetings/next-meetings
 * @desc Returns a list of upcoming meetings the user is invited to
 * @access Private
 */
meetingsRouter.get('/next_meetings', async (req, res) => {
    const nextMeetings = await meetingService.getNextMeetings(auth.email);
    return res.send(nextMeetings);
});

/**
 * @route POST /meetings/create-meeting
 * @desc Creates a new meeting
 * @access Private (Admin only)
 * @body {object} req.body - Meeting details
 */
meetingsRouter.post('/create-meeting', async (req, res) => {
    if (req.auth.admin) {
        await meetingService.createMeeting(req.body);
        return res.send('Meeting created');
    }
});

/**
 * @route GET /meetings/access-meeting
 * @desc Checks if the user has access to a specific meeting
 * @access Private
 * @body {string} meetingID - ID of the meeting
 */
meetingsRouter.get('/access-meeting', async (req, res) => {
    const { meetingID } = req.body;

    const meeting = await meetingService.getMeeting(meetingID);

    if (meeting) {
        if (meeting.participants.includes(req.auth.email)) {
            return res.send(meeting.accessToken);
        } else {
            return res.status(403).send('Not authorized');
        }
    }
    return res.status(404).send('Meeting not found');
});

/**
 * @route GET /meetings/id
 * @desc Returns meeting details by ID
 * @access Private
 * @body {string} meetingID - ID of the meeting
 */
meetingsRouter.get('/id', async (req, res) => {
    const { meetingID } = req.body;
    const auth = req.currentUser;

    const meeting = await meetingService.getMeeting(meetingID);

    if (meeting) {
        if (meeting.participants.includes(req.auth.email)) {
            return res.send(meeting);
        } else {
            return res.status(403).send('Not authorized');
        }
    }
    return res.status(404).send('Meeting not found');
});

module.exports = meetingsRouter;

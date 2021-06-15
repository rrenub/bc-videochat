import axios from 'axios'
import { createToken } from '../utils/fire'
import { v4 as uuidv4 } from 'uuid';
import { BACKEND_URL } from '../utils/api-config'

/**
 * Entrega al servidor la información para añadir la información de una reunión a Firebase
 * 
 * @param {String} name - Nombre de la reunión
 * @param {String} percentage - Porcentaje de consenso para validación de intervenciones
 * @param {String[]} participants - Lista de usuarios invitados a la reunión
 * @param {String} validator - Usuario validador de las intervenciones ("none" si no hay)
 * @param {Date} startDate - Fecha de comienzo de la reunión
 * @param {Date} endDate - Fecha de finalización de la reunión
 */
export const createMeeting = async ({name, percentage, participants, validator, startDate, endDate}) => {
    const header = await createToken();
    const url = `${BACKEND_URL}/meetings/create-meeting`

    const payload = {
        name,
        percentage, 
        participants,
        validator,
        startDate,
        endDate
    }

    const res = await axios.post(url, payload, header);
    return res.data;
}

export const accessMeeting = async (meetingID) => {
    const header = await createToken();
    const getMeetingsURL = `${BACKEND_URL}/meetings/access-meeting`

    const payload = {
        meetingID
    }

    const res = await axios.post(getMeetingsURL, payload, header);
    return res.data;
}
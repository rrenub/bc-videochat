import axios from 'axios'
import { fire, createToken } from '../utils/fire'
import { BACKEND_URL } from '../utils/api-config'
import { v4 as uuidv4 } from 'uuid';

const interventionsURL = `${BACKEND_URL}/interventions`

/**
 * Realiza la validación de las intervenciones seleccionada
 * 
 * @param {boolean} accept - Estado de la validación (true: aceptado - false: denegado)
 * @param {Interventions} intervenciones - Lista de intervenciones a validar
 */
export const validateIntervention = async (accept, interventions) => {
    const header = await createToken();
    const validateURL = `${interventionsURL}/validate`

    const state = accept ? "ACCEPTED" : "DENIED";
    const interventionsMap =  interventions.map(intervention => ({
                                ID: intervention.ID,
                                meetingID: intervention.meetingID
                            }))

    const payload = {
        interventions: interventionsMap,
        state: state
    }

    try {
        const res = await axios.post(validateURL, payload, header);
        console.log(res.data)
        return res.data;
    } catch(e) {
        console.error(e)
    }
}

/**
 * Sube el contenido multimedia de una intervención a Firebase
 * 
 * @param {Blob} audio - Audio de la intervención
 * @param {String} name - Nombre de la intervención
 * @param {String} meetingID - ID de la reunión
 */
export const uploadIntervention = async (audio, name, meetingID) => {
    const interventionID = uuidv4();
    const storageRef = fire.storage().ref(interventionID)
    return new Promise((resolve, reject) => {
        storageRef.put(audio)
            .then((snapshot) => {
                snapshot.ref.getDownloadURL().then(downloadURL => {
                    console.log(name, downloadURL, meetingID, interventionID)
                    createInterventionInfo(name, downloadURL, meetingID, interventionID)
                })
                resolve(snapshot);
            })
    })
}


/**
 * Entrega al servidor la información de la intervención a añadir a Firebase
 * 
 * @param {String} name - Nombre de la intervención
 * @param {String} url - URL del audio de la intervención
 * @param {String} meetingID - ID de la reunión
 * @param {String} interventionID - ID de la intervención
 */
const createInterventionInfo = async (name, url, meetingID, interventionID) => {
    const header = await createToken();
    const validateURL = `${interventionsURL}/new_intervention`

    const payload = {
        name: name,
        url: url,
        meetingID: meetingID,
        interventionID: interventionID
    }

    try {
        const res = await axios.post(validateURL, payload, header);
        console.log(res.data)
        return res.data;
    } catch(e) {
        console.error(e)
    }
}



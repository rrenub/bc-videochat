import axios from 'axios'
import { fire, createToken } from '../utils/fire'
import { BACKEND_URL } from '../utils/api-config'

/**
 * Devuelve la información del usuario
 * 
 * @return - Información del usuario (email)
 */
export const getUser = () => {
    return fire.auth().currentUser
}

/***
 * 
 */
export const deleteAdmin = async (uid) => {
    const header = await createToken();
    const url = `${BACKEND_URL}/users/delete-admin`

    const payload = {
        uid
    }

    const res = await axios.post(url, payload, header);
    return res.data;
}

/***
 * 
 */
 export const addAdmin = async (email) => {
    const header = await createToken();
    const url = `${BACKEND_URL}/users/add-admin`

    const payload = {
        email
    }

    const res = await axios.post(url, payload, header);
    return res.data;
}

export const addNewUser = async (email, name) => {
    const header = await createToken();
    const url = `${BACKEND_URL}/users/add-user`

    const payload = {
        email,
        name
    }

    const res = await axios.post(url, payload, header);
    return res.data;
}
/**
 * Configura el enlace del backend dependiendo del entorno de ejecución (local o en heroku)
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const BACKEND_URL = isDevelopment 
    ? 'http://localhost:3001'
    : 'https://bc-videochat.herokuapp.com'

/*
export const firebaseConfig = {
    apiKey: XXXXXXXXXXXXXXXXXXXX
    authDomain: XXXXXXXXXXXXXXXXXXXX,
    projectId: XXXXXXXXXXXXXXXXXXXX,
    storageBucket: XXXXXXXXXXXXXXXXXXXX,
    messagingSenderId: XXXXXXXXXXXXXXXXXXXX,
    appId: XXXXXXXXXXXXXXXXXXXX
};
*/

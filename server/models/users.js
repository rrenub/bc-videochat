const firebaseAdmin = require('../utils/firebaseAdmin')
const randomstring = require("randomstring");
const Queue = require('bull');
const constants = require('../utils/constants')

const emailQueue = new Queue('sendemail', constants.REDIS_URL);

/**
 * Devuelve una lista de los usuarios registrados en la aplicación
 * 
 * @return {users} Lista de usuarios registrados (lotes de 1000)
 */
const getUserList = async () => {
    var users = [];

    // Lista los usuarios, 1000 como máximo
    const response = await firebaseAdmin
        .admin
        .auth()
        .listUsers(1000)

    response.users.forEach((userRecord) => {
            users.push(userRecord.toJSON())
        }
    );
    return users;
}

/**
 * Quita los privilegios de administración a un usuario
 * @param {String} uid - Identificador del usuario
 */
const deleteAdmin = async (uid) => {
    await firebaseAdmin
            .admin
            .auth()
            .setCustomUserClaims(uid, {admin: false})
}

/**
 * Otorga privilegios de administración a un usuario
 * @param {String} email - Correo electrónico del usuario
 */
const addAdmin = async (email) => {
    console.log('email')

    //Se busca el usuario correspondiente al correo
    await firebaseAdmin
            .admin
            .auth()
            .getUserByEmail(email)
            .then((userRecord) => {
                //Se actualizan sus custom claims
                firebaseAdmin
                    .admin
                    .auth()
                    .setCustomUserClaims(userRecord.uid, {admin: true})
            })
}

/**
 * Otorga acceso a la aplicación a un usuario
 * @param {String} email - Correo electrónico del usuario
 * @param {String} name - Nombre del usuario
 */
const addUser = async (email, name) => {
    const password = randomstring.generate(8)

    await firebaseAdmin
            .admin
            .auth().createUser({
                email: email,
                password: password,
                displayName: name
            })

    await sendEmailCredentials(name, email, password)
}

/**
 * Envía la contraseña al usuario creado
 * @param {String} name - Nombre del usuario
 * @param {String} email - Correo electrónico del usuario
 * @param {String} password - Contraseña del usuario
 */
const sendEmailCredentials = async (name, email, password) => {
    await emailQueue.add({
        subject: `${name}, su usuario ha sido creado para la aplicación web multimedia`,
        text: `Inicie sesión con el email ${email} y la contraseña ${password}.`,
        users: [email]
    })
}

module.exports = {
    getUserList,
    deleteAdmin,
    addAdmin,
    addUser
}
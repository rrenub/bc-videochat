const admin = require('firebase-admin')
const serviceAccount = require('../../serviceAccount.json')

//Inizializa el Firebase SDK para su uso en la apicación
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

//Referencia a firestore
const db = admin.firestore()

module.exports = {
    admin,
    db
}
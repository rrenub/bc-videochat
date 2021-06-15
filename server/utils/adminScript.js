/**
 * Dado que Firebase no permite establecer Custom Claims desde el panel de administración de Firebase,
 * este script permite establecer un custom claim de admin dado el usuario indicado en la variable email.
 */

const { admin } = require('./firebaseAdmin');

var email = 'cuenta.rubendelgado@gmail.com';

admin.auth().getUserByEmail(email)
    .then((user) => {
        admin.auth().setCustomUserClaims(user.uid, {admin: true})
    })
    .then(() => {
        console.log('added admin successfully')
    })

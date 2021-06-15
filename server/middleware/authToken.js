const firebaseAdmin = require('../utils/firebaseAdmin')

/**
 * Middleware para verificar autenticación del usuario con Firebase
 */
async function decodeIDToken(req, res, next) {
    //console.log('Decoding token to see if user is authenticated')
    const header = req.headers?.authorization;
    if (header !== 'Bearer null' && req.headers?.authorization?.startsWith('Bearer ')) {
        const idToken = req.headers.authorization.split('Bearer ')[1];
        try {
            const decodedToken = await firebaseAdmin.admin.auth().verifyIdToken(idToken);
            req['currentUser'] = decodedToken;
            //console.log(`Request of user authenticated with token ${decodedToken}`)
        } catch (err) {
            console.log(err);
        }
    }
    next();
}

  module.exports = decodeIDToken;
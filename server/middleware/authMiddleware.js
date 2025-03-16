const firebaseAdmin = require('../utils/firebaseAdmin')

async function authMiddleware(req, res, next) {

    // get firebase token
    const authHeader = req.headers?.authorization;
    const auth = decodeFirebaseAuthToken(authHeader)

    // return 403 if not authenticated
    if(!auth) {
        return res.sendStatus(403);
    }

    req.auth = auth;
    next();
}

async function decodeFirebaseAuthToken(authHeader) {
    if (authHeader !== 'Bearer null' && authHeader.startsWith('Bearer ')) {
        const idToken = authHeader.split('Bearer ')[1];
        try {
            const decodedToken = await firebaseAdmin.admin.auth().verifyIdToken(idToken);
            return decodedToken;
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = decodeIDToken;
const usersRouter = require('express').Router();
const userService = require('../models/users')

/**
 * Ruta: /users/adminlist
 * Descripción: Devuelve una lista de los usuarios registrados en la plataforma
 */
 usersRouter.post('/adminlist', async (req, res) => {
    const auth = req.currentUser;

    if(auth) {
        if(auth.admin) {
            const userlist = await userService.getUserList()
            const admins = userlist.filter(user =>  
                user.customClaims !== undefined && user.customClaims.admin
            )
            console.log(admins)
            return res.send(admins)
        }
    }

    return res.status(403).send('Not authorized')
})

/**
 * Ruta: /users/userlist
 * Descripción: Devuelve una lista de los usuarios registrados en la plataforma
 */
usersRouter.get('/userlist', async (req, res) => {
    const auth = req.currentUser;

    if(auth) {
        if(auth.admin) {
            const userlist = await userService.getUserList()
            return res.send(userlist)
        }
    }

    return res.status(403).send('Not authorized')
})

/**
 * Ruta: /users/delete-admin
 * Descripción: Elimina un administrador
 */
 usersRouter.post('/delete-admin', async (req, res) => {
    const { uid } = req.body
    const auth = req.currentUser;

    console.log(uid)

    if(auth) {
        if(auth.admin) {
            await userService.deleteAdmin(uid)
            return res.send('admin deleted')
        }
    }

    return res.status(403).send('Not authorized')
})

/**
 * Ruta: /users/add-admin
 * Descripción: Otorga el rol de administrador a un usuario
 */
 usersRouter.post('/add-admin', async (req, res) => {
    const { email } = req.body
    const auth = req.currentUser;

    //Comprobación si está autenticado y si es administrador
    if(auth) {
        if(auth.admin) {
            try {
                await userService.addAdmin(email)
                return res.send('admin added')
            } catch(error) {
                console.error(error)
                return res.status(404).send('User not found')
            }
        }
    }

    return res.status(403).send('Not authorized')
})

/**
 * Ruta: /users/add-user
 * Descripción: Crea un nuevo usuario y envía las credenciales a su email
 */
 usersRouter.post('/add-user', async (req, res) => {
    const { email, name } = req.body
    const auth = req.currentUser;

    if(auth) {
        if(auth.admin) {
            try {
                await userService.addUser(email, name)
                return res.send('user added')
            } catch(error) {
                console.error(error)
                return res.status(400).send('Error adding user')
            }
        }
    }

    return res.status(403).send('Not authorized')
})


module.exports = usersRouter
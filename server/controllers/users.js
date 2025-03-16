const usersRouter = require('express').Router();
const userService = require('../models/users')

/**
 * @route GET /users/admins
 * @description Returns a list of registered users who are administrators
 * @returns {Object[]} Array of administrator users
 */
usersRouter.get('/admins', async (req, res) => {
    const userlist = await userService.getUserList();

    const admins = userlist.filter(user =>  
        user.customClaims !== undefined && user.customClaims.admin
    );

    return res.send(admins);
});

/**
 * @route GET /users/users
 * @description Returns a list of all registered users on the platform
 * @returns {Object[]} Array of registered users
 */
usersRouter.get('/users', async (req, res) => {
    const userlist = await userService.getUserList();
    return res.send(userlist);
});

/**
 * @route DELETE /users/admin
 * @description Removes an administrator role from a user
 * @param {string} req.body.uid - The UID of the user to be demoted
 */
usersRouter.delete('/admin', async (req, res) => {
    const { uid } = req.body;

    await userService.deleteAdmin(uid);
    return res.send('Admin deleted');
});

/**
 * @route POST /users/admin
 * @description Grants admin role to a user
 * @param {string} req.body.email - The email of the user to be promoted
 */
usersRouter.post('/admin', async (req, res) => {
    const { email } = req.body;

    try {
        await userService.addAdmin(email);
        return res.send('Admin added');
    } catch(error) {
        console.error(error);
        return res.status(404).send('User not found');
    }
});

/**
 * @route POST /users/user
 * @description Creates a new user and sends credentials to their email
 * @param {string} req.body.email - The email of the new user
 * @param {string} req.body.name - The name of the new user
 */
usersRouter.post('/user', async (req, res) => {
    const { email, name } = req.body;

    try {
        await userService.addUser(email, name);
        return res.send('User added');
    } catch(error) {
        console.error(error);
        return res.status(400).send('Error adding user');
    }
});

module.exports = usersRouter;

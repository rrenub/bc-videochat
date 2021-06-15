const nodemailer = require('nodemailer')
const constants = require('./constants')

//Datos para el envío de email
let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: constants.EMAIL,
        pass: constants.EMAIL_PASSWORD
    }
});


/**
 * Realiza el envío de un correo
 * @param mailDetails - Datos para realizar el envío del email  
 */
const sendEmail = ({to, subject, text}) => {
    const mailDetails = {
        from: constants.EMAIL,
        to,
        subject,
        text
    }

    mailTransporter.sendMail(mailDetails, function(err, data) {
        if(err) {
            console.log('Error Occurs', err);
        } else {
            console.log('Email sent successfully');
        }
    });
}

module.exports = {
    sendEmail
}

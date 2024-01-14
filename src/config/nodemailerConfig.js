// config/nodemailerConfig.js
const nodemailer = require('nodemailer');
const config = require('./config');

const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use the email service you prefer
    auth: {
        user: config.email, // email address
        pass: config.password, // email password
    },
});

module.exports = transporter;

require('dotenv').config();

module.exports = {
  mongoURI: process.env.mongoURI,
  jwtSecret: process.env.jwtSecret,

  // nodemailer credentials
  email: process.env.emailAddress,
  password: process.env.emailPassword,

  frontendURL: process.env.frontendURL || 'http://localhost:5173',
};

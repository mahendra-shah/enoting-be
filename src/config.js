require('dotenv').config();
console.log(process.env.mongoURI, '((((')

module.exports = {
    mongoURI: process.env.mongoURI,
    jwtSecret: process.env.jwtSecret,
  };
  
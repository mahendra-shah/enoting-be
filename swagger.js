const swaggerAutogen = require('swagger-autogen')();
require('dotenv').config();

const doc = {
    info: {
        title: "iNotebook API",
        description: "API for managing iNotebook's users and notes",
    },
    host: `localhost:${process.env.PORT}`,
    schemes: ['http', 'https'],
    securityDefinitions: {
        apiKey: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
            description: 'API key authentication'
        }
    },
    security: [
        {
            apiKey: [],
        },
    ],
};
const outputFile = "./swagger.json";
const endpointsFiles = ["./src/routes/*.js"];
swaggerAutogen(outputFile, endpointsFiles, doc);

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const config = require('./config');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('-- Connected to MongoDB --'))
  .catch(err => console.error('Error connecting to MongoDB', err));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Routes
const authRoutes = require('./routes/authRoutes');
const notesRoutes = require('./routes/notesRoutes');

app.use('/', authRoutes);
app.use('/', notesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running here http://localhost:${PORT}/api-docs`));

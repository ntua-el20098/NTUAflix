const express = require('express');
const cors = require('cors');
require('dotenv').config();


/* Import routes */
const routes = require('./routes/allroutes');

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Routes used */
app.use('/ntuaflix_api', routes);

app.use((req, res, next) =>
{ res.status(404).json({ message: 'Endpoint not found' }) });

module.exports = app;
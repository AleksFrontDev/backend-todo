require('dotenv').config();
const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');

const app = express();

app.use(cors());
app.use(express.json());

//Routes
app.use('/tasks', taskRoutes);

module.exports = app;

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth.routes');
const logger = require('./middleware/logger.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger.httpLogger);

app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

//Routes
app.use('/tasks', taskRoutes);
app.use('/auth', authRoutes);

module.exports = app;

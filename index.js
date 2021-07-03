const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const winston = require('winston');
const PORT = process.env.PORT || 3000;
const booksRoute = require('./routes/books');
// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// create a logger
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.colorize({ all: true }),
    }),
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'exceptions.log' }),
  ],
});

// routes
app.use('/api/books', booksRoute);
// connect to mongodb
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true })
  .then(() => {
    logger.info('connected to mongodb atlas');
  })
  .catch(err => {
    logger.error(err.message);
  });

app.listen(PORT, () => {
  logger.warn(`Server started at PORT ${PORT}`);
});

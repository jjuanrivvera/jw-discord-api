const container = require('./src/startup/container');
const server = container.resolve('app');
const { MONGO_DSN } = container.resolve('config');

const mongoose = require('mongoose');

mongoose
    .connect(MONGO_DSN)
    .then(() => server.start())
    .catch(console.log);

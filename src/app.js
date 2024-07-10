const express = require('express');

const urlRouter = require('./routes/url.routes');
const analyticsRouter = require('./routes/analytics.routes');
const { handleShortAccess } = require('./controllers/operation/short.controller');
const { handleCustomAccess } = require('./controllers/operation/custom.controller');

const app = express();

app.use(express.json());

app.use('/url', urlRouter);
app.use('/analytics', analyticsRouter);

//To accept short id generation requests
app.get('/:shortId', handleShortAccess);
//To accept custom id generation requests
app.get('/c/:customId', handleCustomAccess);

module.exports = app;
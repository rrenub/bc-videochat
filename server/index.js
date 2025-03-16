const express = require('express');
const app = require('./app')
const path = require('path');
const server = require('http').Server(app)
const cors = require('cors')
const morgan = require('morgan')
const SocketService = require ('./utils/socket')

const meetingsRouter = require('./controllers/meetings')
const usersRouter = require('./controllers/users')
const interventionsRouter = require('./controllers/interventions')
const blockchainRouter = require('./controllers/blockchain')

// middlewares
app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(morgan(':method :url - status: :status - :response-time ms'))
app.use(express.json())
app.use(cors())

// api controllers
app.use('/users', usersRouter)
app.use('/meetings', meetingsRouter)
app.use('/interventions', interventionsRouter)
app.use('/blockchain', blockchainRouter)

// webrtc signaling server
app.set("socketService", new SocketService(server));

// init server
const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Express server listening on port ${port}`)
})

// set up spa for react
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

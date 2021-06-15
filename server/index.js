const express = require('express');
const app = require('./app')
const path = require('path');
const server = require('http').Server(app)
const cors = require('cors')
const morgan = require('morgan')
const SocketService = require ('./utils/socket')

//Controladores
const meetingsRouter = require('./controllers/meetings')
const usersRouter = require('./controllers/users')
const interventionsRouter = require('./controllers/interventions')
const blockchainRouter = require('./controllers/blockchain')
const decodeIDToken = require('./middleware/authToken')

/**
 * Declaración de middlewares del servidor
 */
// Sirve los archivos del proyecto de React del frontend
app.use(express.static(path.resolve(__dirname, '../client/build')));
//Logger de peticiones HTTP
app.use(morgan(':method :url - status: :status - :response-time ms'))
// Autenticación de Firebase
app.use(decodeIDToken)
// Parsea las peticiones recibidas JSON.
app.use(express.json())
//Permite habilitar CORS
app.use(cors())

//Controladores de la API
app.use('/users', usersRouter)
app.use('/meetings', meetingsRouter)
app.use('/interventions', interventionsRouter)
app.use('/blockchain', blockchainRouter)

app.set("socketService", new SocketService(server));

//Configura el servicio de señalización de WebRTC
//setupWebRTCSignalling(io)

//Inicializa el servidor para recibir peticiones
const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Express server listening on port ${port}`)
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

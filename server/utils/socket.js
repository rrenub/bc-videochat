const socketIo = require('socket.io');
const meetingService = require('../models/meetings')

const users = {};
const socketToRoom = {};

/**
 * Realiza la configuración del servidor de señalización en Firebase con SocketIO
 * 
 * @param io - Instancio de SocketIO
 */
class SocketService {
   constructor(server) {
     this.io = socketIo(server);
     this.io.on('connection', socket => {
        console.log('user connected')

        /**
         * Mensaje recibido cuando un peer se intenta unir a sala multimedia
         */
        socket.on('join', async (payload) => {
            const roomId = payload.room
            const roomClients = this.io.sockets.adapter.rooms.get(roomId) || { length: 0 }
            const numberOfClients = roomClients.length

            console.log(`Room ID: ${roomId}`)
            console.log(`numberOfClients of ${roomId}: ${numberOfClients}`)

            //Se comprueba el token de acceso
            const isAuthorized = await meetingService.isAuthorized(payload.room, payload.token)

            if(!isAuthorized) {
                console.log('Token received is incorrect. User not authorized')
                return;
            }
        
            //La reunión está vacía
            if (numberOfClients == 0) {
                console.log(`Creating room ${roomId} and emitting room_created socket event`)
                await socket.join(roomId)
                socket.emit('room_created', {
                    roomId: roomId,
                    peerId: socket.id
                })
                
            //Hay clientes en la reunión
            } else {
                console.log(`Joining room ${roomId} and emitting room_joined socket event`)
                await socket.join(roomId)
                socket.emit('room_joined', {
                    roomId: roomId,
                    peerId: socket.id
                })
            } 
        })
        
        // Este mensaje se retransmite a todos los pares que se encuentran en la sala
        socket.on('start_call', (event) => {
            socket.broadcast.to(event.roomId).emit('start_call', {
                senderId: event.senderId
            })
        })
        
        // El resto de mensajes se retransmiten al par indicado
        socket.on('webrtc_offer', (event) => {
            console.log(`Sending webrtc_offer event to peers in room ${event.roomId} from peer ${event.senderId} to peer ${event.receiverId}`)
            socket.broadcast.to(event.receiverId).emit('webrtc_offer', {
            sdp: event.sdp,
            senderId: event.senderId
        })})
        
        socket.on('webrtc_answer', (event) => {
            console.log(`Sending webrtc_answer event to peers in room ${event.roomId} from peer ${event.senderId} to peer ${event.receiverId}`)
            socket.broadcast.to(event.receiverId).emit('webrtc_answer', {
            sdp: event.sdp,
            senderId: event.senderId
        })})
        
        socket.on('webrtc_ice_candidate', (event) => {
            console.log(`Sending webrtc_ice_candidate event to peers in room ${event.roomId} from peer ${event.senderId} to peer ${event.receiverId}`)
            socket.broadcast.to(event.receiverId).emit('webrtc_ice_candidate', event)
        })
    
        });
    } 

    //Para enviar mensajes desde el servidor
    emiter(event, body) {
        if(body)
        this.io.emit(event, body);
    }
}



module.exports = SocketService;


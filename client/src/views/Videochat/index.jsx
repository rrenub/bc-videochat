import React, { useRef, useEffect, useState } from 'react';
import io from "socket.io-client";
import { withRouter } from 'react-router-dom';
import { Result, Spin } from 'antd'
import adapter from 'webrtc-adapter';

import { accessMeeting } from '../../services/meetingServices'
import AlertInfo from '../../components/AlertInfo'
import VideoControls from './components/VideoControls'
import Video from './components/Video'
import Loading from './components/Loading'
import '../../App.css'

const mediaConstraints = {
    audio: true,
    video: true,
}

const offerOptions = {
    offerToReceiveVideo: 1,
    offerToReceiveAudio: 1,
};

// Servidores ICE usados. Solo servidores STUN en este caso.
const iceServers = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'turn:' + 'rubendelgado.me' + ':3478',
            username: 'prueba',
            credential: 'prueba1234'
        }  
    ],
}

const Videochat = (props) => {
    const [loading, setLoading] = useState(true)
    const [peerStreams, setPeerStreams] = useState([])
    const socketRef = useRef();
    const userVideoRef = useRef();
    const peersRef = useRef([]);
    const localStreamRef = useRef([]);
    const [isAuth, setIsAuth] = useState(false);
    const [isMediaDenied, setIsMediaDenied] = useState(false)
 
    const meetingID = props.match.params.id;


    useEffect(async () => {
        document.title = "Reunión"

        try {
            const meetingToken = await accessMeeting(meetingID)
            setIsAuth(true)
            startConnection(meetingToken);
        } catch (e) {
            console.log(e)
        }

        setLoading(false)
            
        return (() => {
            quitMeeting()
        })

    }, [])

    const startConnection = async (meetingToken) => {
        socketRef.current = await io.connect("/");

        setupSocketIO()

        joinRoom(meetingID, meetingToken)
    }

    const joinRoom = (room, meetingToken) => {
        socketRef.current.emit('join', {
            room: room, 
            token: meetingToken,
            peerUUID: socketRef.current.id
        })
    }

    /**
     * Recoge el stream local multimedia usando API getUserMedia
     */
    const setLocalStream = async () => {
        console.log('Local stream set')
        
        let stream
        try {
            stream = await navigator.mediaDevices.getUserMedia(mediaConstraints)
        } catch (error) {
            console.error('Could not get user media', error)
            setIsMediaDenied(true)
            return false;
        }

        localStreamRef.current = stream
        userVideoRef.current.srcObject = stream;
        return true;
    }

    /**
     * Callback cuando se recibe el stream multimedia del par remoto
     */
    const setRemoteStream = (event, remotePeerId) => {
        console.log('Remote stream set from ', remotePeerId)
        if(event.track.kind == "video") {
            console.log('stream del colega', event.streams[0])
            setPeerStreams(prevStreams => [...prevStreams, {
                    id: remotePeerId,
                    stream: event.streams[0]
                }
            ])
        } 
    }

    const setupSocketIO = (stream) => {
        socketRef.current.emit("join room", meetingID);

        /**
         * Mensaje room_created recibido al unirse a una sala vacía
         */
        socketRef.current.on('room_created', async (event) => {
            console.log(`Current peer ID: ${socketRef.current.id}`)
            console.log(`Socket event callback: room_created with by peer ${socketRef.current.id}, created room ${meetingID}`)

            await setLocalStream()
        })

        /**
         * Mensaje room_joined al unirse a una sala con pares conectados. Comienza la llamada enviando
         * start_call
         */
        socketRef.current.on('room_joined', async (event) => {
            console.log(`Current peer ID: ${socketRef.current.id}`)
            console.log(`Socket event callback: room_joined by peer ${socketRef.current.id}, joined room ${meetingID}`)
        
            await setLocalStream()

            console.log(`Emit start_call from peer ${socketRef.current.id}`)
            socketRef.current.emit('start_call', {
                roomId: meetingID,
                senderId: socketRef.current.id
            })
        })

        /**
         * Mensaje start_call recibido y crea el objeto RTCPeerConnection para enviar la oferta al otro par
         */
        socketRef.current.on('start_call', async (event) => {
            const remotePeerId = event.senderId;
            console.log(`Socket event callback: start_call. RECEIVED from ${remotePeerId}`)
        
            const peer = new RTCPeerConnection(iceServers)
            setupPeer(peer, remotePeerId)

            addLocalTracks(peer)

            sendOffer(remotePeerId, await createOffer(peer))
        })

        /**
         * Mensaje webrtc_offer recibido con la oferta y envía la respuesta al otro par
         */
        socketRef.current.on('webrtc_offer', async (event) => {
            console.log(`Socket event callback: webrtc_offer. RECEIVED from ${event.senderId}`)
            const remotePeerId = event.senderId;
        
            const peer = new RTCPeerConnection(iceServers)
            setupPeer(peer, remotePeerId)

            peer.setRemoteDescription(new RTCSessionDescription(event.sdp))
            console.log(`Remote description set on peer ${socketRef.current.id} after offer received`)
                
            addLocalTracks(peer)

            sendAnswer(remotePeerId, await createAnswer(peer))
        })

        /**
         * Mensaje webrtc_answer recibido y termina el proceso offer/answer.
         */
        socketRef.current.on('webrtc_answer', async (event) => {
            const senderPeerId = event.senderId
            console.log(`Socket event callback: webrtc_answer. RECEIVED from ${senderPeerId}`)

            const peerInfo = peersRef.current.find(peer => peer.peerID === senderPeerId)

            peerInfo.peer.setRemoteDescription(new RTCSessionDescription(event.sdp))
            console.log(`Remote description set on peer ${socketRef.current.id} after answer received`)
        })

        /**
         * Mensaje webrtc_ice_candidate. Candidato ICE recibido de otro par
         */
        socketRef.current.on('webrtc_ice_candidate', (event) => {
            const senderPeerId = event.senderId;
            console.log(`Socket event callback: webrtc_ice_candidate. RECEIVED from ${senderPeerId}`)
        
            // ICE candidate configuration.
            var candidate = new RTCIceCandidate({
                sdpMLineIndex: event.label,
                candidate: event.candidate,
            })

            const peerInfo = peersRef.current.find(peer => peer.peerID === senderPeerId)

            peerInfo.peer.addIceCandidate(candidate)
        })
    }

    const sendIceCandidate = (event, remotePeerId) => {
        if (event.candidate) {
            console.log(`Sending ICE Candidate from peer ${socketRef.current.id} to peer ${remotePeerId}`)
            socketRef.current.emit('webrtc_ice_candidate', {
                senderId: socketRef.current.id,
                receiverId: remotePeerId,
                roomId: meetingID,
                label: event.candidate.sdpMLineIndex,
                candidate: event.candidate.candidate,
            })
        }
    }

    const setupPeer = (peer, remotePeerId) => {
        peer.ontrack = (event) => setRemoteStream(event, remotePeerId)
        peer.oniceconnectionstatechange = (event) => checkPeerDisconnect(event, remotePeerId);
        peer.onicecandidate = (event) => sendIceCandidate(event, remotePeerId)

        peersRef.current.push({
            peerID: remotePeerId,
            peer
        })
    }

    const addLocalTracks = (peer) => {
        localStreamRef.current.getTracks().forEach((track) => {
            console.log('adding track offer', track)
            peer.addTrack(track, localStreamRef.current)
        })
    }

    const createOffer = async (peer) => {
        let sessionDescription;

        try {
            sessionDescription = await peer.createOffer(offerOptions)
            peer.setLocalDescription(sessionDescription)
        } catch (error) {
            console.error(error)
        }

        return sessionDescription;
    }

    const createAnswer = async (peer) => {
        let sessionDescription;

        try {
            sessionDescription = await peer.createAnswer(offerOptions)
            peer.setLocalDescription(sessionDescription)
        } catch (error) {
            console.error(error)
        }

        return sessionDescription;
    }

    /**
     * Envía la info SDP de respuesta
     */
    const sendAnswer = (remotePeerId, answer) => {
        console.log(`Sending answer from peer ${socketRef.current.id} to peer ${remotePeerId}`)
        
        socketRef.current.emit('webrtc_answer', {
            type: 'webrtc_answer',
            sdp: answer,
            roomId: meetingID,
            senderId: socketRef.current.id,
            receiverId: remotePeerId
        })
    }

    /**
     * Envía la info SDP de oferta
     */
    const sendOffer = (remotePeerId, offer) => {
        console.log(`Sending offer from peer ${socketRef.current.id} to peer ${remotePeerId}`)

        socketRef.current.emit('webrtc_offer', {
            type: 'webrtc_offer',
            sdp: offer,
            roomId: meetingID,
            senderId: socketRef.current.id,
            receiverId: remotePeerId
        })
    }

    /**
     * Comprueba si el par se ha desconectado cuando recibe el evento onicestatechange del objeto RTCPeerConnection
     */
    const checkPeerDisconnect = (event, remotePeerId) => {
        const peerInfo = peersRef.current.find(peer => peer.peerID === remotePeerId)
        const state = peerInfo.peer.iceConnectionState;
        console.log(`connection with peer ${remotePeerId}: ${state}`);
    
        if (state === "failed" || state === "closed" || state === "disconnected") {
            console.log(`Peer ${remotePeerId} has disconnected`);
            console.log('los streams', peerStreams)
            setPeerStreams(peerStreams.filter(stream => stream.id !== remotePeerId))
        }
    }
    
    const quitMeeting = () => {
        window.close()
    }

    const mediaDeniedAlert = (
        <AlertInfo
            message="Error: Acceso a contenido multimedia"
            type="error">
                Debe permitir la captura de vídeo y audio. Desde la configuración de su navegador, 
                permita el uso de la cámara/micrófono y recargue la página de la reunión
        </AlertInfo>
    )

    return (
        loading
            ? <Loading />
            : (
        !isAuth 
            ? (<Result
                    status="warning"
                    title="Error al acceder a la reunión"
                    subTitle="No está autorizado a entrar en esta reunión"/>)
            : (<div className="main_videochat">

                    { isMediaDenied ? mediaDeniedAlert : null}

                    <div className="main_videos_videochat">
                        <div className="video_grid">

                            <video 
                                muted
                                ref={userVideoRef} 
                                autoPlay 
                                playsInline 
                                className="user_videochat"/>

                            {peerStreams.map(peer => 
                                <Video
                                    key={peer.id}
                                    stream={peer.stream}
                                    peer={peer.id}
                                />
                            )}

                        </div>
                    </div>

                    <VideoControls
                        isMediaDenied={isMediaDenied}
                        quitMeeting={quitMeeting}
                        meetingID={meetingID} />
            </div>)
        )
    )
};

export default withRouter(Videochat);
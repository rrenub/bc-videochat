import React, { useRef, useEffect } from 'react';
import '../../../App.css'

const Video = (props) => {
    const {peer, stream} = props
    const ref = useRef();
    
    useEffect(() => {
        console.log('Mounting stream from peer', peer)
        ref.current.srcObject = stream;

        return (() => {
            console.log(`Disconnecting peer ${peer}...`)
        })
    }, []);

    return (
        <video 
            key={peer}
            playsInline 
            autoPlay 
            ref={ref} 
            className="user_videochat"
        />
    );
}

export default Video;

import React from 'react'
import InterventionRecorder from './InterventionRecorder'
import { Link } from 'react-router-dom';
import { Button } from 'antd'
import { LogoutOutlined } from '@ant-design/icons';
import '../../../App.css'

const VideoControls = (props) => {
    const {meetingID, quitMeeting, isMediaDenied} = props

    return (
        <div className="main_controls">

            {
                !isMediaDenied 
                    ? (
                        <div className="main_controls_block">
                            <InterventionRecorder meetingID={meetingID}/>
                        </div>
                    )
                    : null
            }
            
            <div className="main_controls_block">
                <Link to="/">
                    <Button 
                        danger 
                        type="primary"
                        icon={<LogoutOutlined />} 
                        onClick={quitMeeting}>Salir</Button>
                </Link>
            </div>
        </div>
    )
}

export default VideoControls
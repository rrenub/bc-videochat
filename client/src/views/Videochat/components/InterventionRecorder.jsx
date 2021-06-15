import React, { useState } from 'react';
import { Button, Modal, Input, Form, Space, Badge, Typography } from 'antd'
import useMediaRecorder from '@wmik/use-media-recorder';
import Countdown from 'react-countdown';
import ReactAudioPlayer from 'react-audio-player'
import { uploadIntervention } from '../../../services/interventionServices'
import '../../../App.css'

//2 minutos en ms
const INTERVENTION_TIME_LIMIT = 120000

const InterventionRecorder = (props) => {
    const { meetingID } = props

    let {
        status,
        mediaBlob,
        stopRecording,
        startRecording
    } = useMediaRecorder({
        blobOptions: { type: 'audio/webm;codecs=opus' },
        mediaStreamConstraints: { audio: true }
    });

    const [form] = Form.useForm();
    const [isRecording, setIsRecoding] = useState(false)
    const [interventionRecorded, setinterventionRecorded] = useState(false)
    const [interventionName, setInterventionName] = useState("");
    const [uploading, setUploading] = useState(false)

    const resetIntervention = () => {
        setinterventionRecorded(false)
        form.resetFields()
    }

    const handleCancelIntervention = () => {
        console.log('Intervention upload cancelled!')
        resetIntervention()
    }

    const handleSubmitIntervention = async () => {
        console.log('Intervention upload confirmed!')
        setUploading(true)
        uploadIntervention(mediaBlob, interventionName, meetingID)
            .then((snapshot) => {
                setUploading(false)
                resetIntervention()
            })
    }

    const handleIntervention = async () => {
        console.log('Intervention button clicked')
        if(isRecording) {
            console.log('Stop recording')
            setIsRecoding(false)
            setinterventionRecorded(true)
            stopRecording()
        } else {
            console.log('Recording...')
            setIsRecoding(true)
            startRecording()
        }
    }

    return (
        <>
            <Modal
                title="Guardar intervención realizada"
                visible={interventionRecorded}
                onCancel={handleCancelIntervention}
                confirmLoading={uploading}
                footer={[
                    <>  
                        <Button key="back" onClick={handleCancelIntervention}>Cancelar</Button>
                        <Button loading={uploading} type="primary" form="interventionForm" htmlType='submit'>
                            Guardar intervención
                        </Button>
                    </>
                ]}>
            
                <Form
                    form={form}
                    name="interventionForm"
                    onFinish={handleSubmitIntervention}>
                    <Form.Item 
                        label="Nombre de la reunión"
                        name="name"
                        rules={[{ required: true}]}>
                        <Input allowClear onChange={({target}) => setInterventionName(target.value)}/>
                    </Form.Item>
                        {
                            (status === 'stopped') 
                                ? <ReactAudioPlayer
                                    src={URL.createObjectURL(mediaBlob)}
                                    controls/>
                                : null
                        }         
                </Form>
            </Modal>

                {
                    isRecording 
                        ? (
                        <div className="countdown">
                            <Badge status="processing" size="default"/>
                            <Countdown 
                                date={Date.now() + INTERVENTION_TIME_LIMIT} 
                                onComplete={handleIntervention}/>
                        </div>)
                        : null
                }
                <Button 
                    type="primary" 
                    onClick={handleIntervention}>
                        {isRecording ? "Terminar grabación" : "Grabar intervención"}
                </Button>
        </>
    )
}

export default InterventionRecorder

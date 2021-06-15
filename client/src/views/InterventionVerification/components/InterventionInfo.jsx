import React, { useState } from  'react'
import axios from 'axios'
import { Descriptions, Button, message } from 'antd';
import useDownload from '../../../hooks/use-download'

const InterventionInfo = (props) => {
    const {intervention} = props

    const [ 
        audio, 
        isLoading, 
        error, 
        downloadAudio 
    ] = useDownload(intervention.url)

    const renderDownload = () => {
        if(error) {
            message.error('Ha ocurrido un error al descargar el audio')
        }

        if(!audio) {
            return (
                <Button 
                    type="text"
                    loading={isLoading}
                    onClick={downloadAudio}>
                        Descargar Audio
                </Button>
            )
        } else {
            const audioURL = URL.createObjectURL(audio)
            return(
                <a download={intervention.name} href={audioURL}>Descargar contenido</a>
            )
        }
    }

    return (
        <Descriptions bordered title={`Intervención: ${intervention.name}`}>
            <Descriptions.Item label="ID de la intervención">
                {intervention.ID}
            </Descriptions.Item>

            <Descriptions.Item label="Descargar">
                {renderDownload()}
            </Descriptions.Item>
        </Descriptions> 
    )
}

export default InterventionInfo;

import React, { useEffect, useState, useRef} from  'react'
import useFetch from '../../../hooks/use-fetch'
import io from "socket.io-client";
import { Space, Typography, Spin, Steps, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import AlertInfo from '../../../components/AlertInfo'
import '../../../App.css'

const { Title } = Typography
const { Step } = Steps;

const VerificationSteps = (props) => {
    const {interventionID, audioURL} = props

    const [calculatedToken, setCalculatedToken] = useState(null)
    const [onCalculated, setOnCalculated] = useState(false)
    const socketRef = useRef()

    const [ token, 
            isLoadingToken, 
            errorToken, 
            fetchToken] = useFetch('/blockchain/verify', {interventionID, audioURL})


    useEffect(() => {
        fetchToken()
        setupSocket()

        console.log('enviando informacion del audio', interventionID, audioURL)

        return () => {
            socketRef.current.close()
        }
    }, [])

    const setupSocket = () => {
        console.log('setting up socket')

        socketRef.current = io.connect("/");

        socketRef.current.on('token-hash', message => {
            if(message.result === 'error') {
                message.error('Ha ocurrido un error al calcular el hash del audio')
            }
            const { token:{ interventionToken } } = message
            
            setCalculatedToken(interventionToken)
            setOnCalculated(true)
        })
    }

    const renderTokenStep = () => {
        if(errorToken) {
            return (
                <AlertInfo
                    type="error"
                    title="Ha ocurrido un error aqui">{errorToken}</AlertInfo>
            )
        }

        if(isLoadingToken) {
            return (<Spin/>)
        }

        if(token) {
            return (
                <Step
                    status="finish"
                    title="Token de la intervención encontrado en la blockchain"
                    description={`Token de la intervención: ${token.interventionToken}`}/>
            )
        } else {
            return (
                <Step
                    status="error"
                    title="Token de la intervención no ha sido añadido a la blockchain"
                    description={`La transacción correspondiente a la intervención ${interventionID} aún no ha sido agregada a la cadena de bloques`}/>
            )
        }
    }

    const renderCalculatedToken = () => {
        if(!errorToken){
            if(onCalculated) {
                socketRef.current.close()
                return (
                    <Step
                        status="finish"
                        title="Calculado hash de la intervención"
                        description={`Hash de la intervención calculado: ${calculatedToken}`}/>
                )
            } else {
                return (
                    <Step
                        icon={token ? <LoadingOutlined />: null}
                        status="wait"
                        title="Calculando hash de la intervención..."
                        description='Este proceso puede demorarse dependiendo del tamaño de audio almacenado de la intervención'/>
                )
            }
        } else {
            return null
        }
    }

    const renderResult = () => {
        if(onCalculated) {
            if(calculatedToken === token.interventionToken) {
                return (
                    <Step
                    status="finish"
                    title="El audio de la intervención es válido y no ha sido alterado"
                    description="El hash calculado y el token de la intervención almacenado en la blockchain coinciden"/>
                )
            } else {
                return (
                    <Step
                        status="error"
                        title="No es posible confirmar la validez del audio de la intervención"
                        description="El hash calculado y el token almacenado en la blockchain no coinciden, por lo que es posible que el audio haya sido alterado"/>
                )
            }
        }
    }


    return (
        <div className="main">
            <Space direction="vertical" size={20}>
                <Title level={5}>Proceso de verificación</Title>
                    <Steps direction="vertical">
                        {renderTokenStep()}
                        {renderCalculatedToken()}
                        {renderResult()}
                    </Steps>
            </Space>
        </div>
    )
}

export default VerificationSteps;
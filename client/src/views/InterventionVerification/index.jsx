import React, { useEffect, useState } from 'react'
import { Spin } from 'antd'
import useFetch from '../../hooks/use-fetch'
import HeaderText from '../../components/HeaderText'
import AlertInfo from '../../components/AlertInfo'
import VerificationSteps from './components/VerificationSteps'
import InterventionInfo from './components/InterventionInfo'

const InterventionVerification = (props) => {
    const interventionID = props.match.params.id;

    const [ intervention, 
            isLoading, 
            error, 
            fetchIntervention ] = useFetch('/interventions/intervention', {interventionID})


    useEffect(() => {
        fetchIntervention()
    }, [])

    const renderContent = () => {
        if(error) {
            return (
                <AlertInfo
                    type="error"
                    title="Ha ocurrido un error aqui">{error}</AlertInfo>
            )
        }

        if(isLoading) {
            return <Spin />
        } 
        
        if(intervention.length !== 0) {
            return (
                <>
                    <InterventionInfo 
                        intervention={intervention} />
                    <VerificationSteps 
                        interventionID={interventionID}
                        audioURL={intervention.url}/>
                </>
            )
        }
    }


    return (
        <>
            <HeaderText>Verificación del audio de la intervención</HeaderText>
            {renderContent()}
        </>
    )
}

export default InterventionVerification
import React from  'react'
import { Descriptions, Typography, Skeleton} from 'antd';
import AlertInfo from '../../../components/AlertInfo'

const { Title } = Typography;

const MeetingInfo = (props) => {
    const { meeting, loading, error } = props

    const percentageItem = () => {
        return (
            <Descriptions.Item label="Porcentaje de votación">
                {`${meeting.percentage}%`}
            </Descriptions.Item>
        ) 
    }
        
    const renderContent = () => {
        if(error) {
            return (
                <AlertInfo
                    type="error"
                    title="Ha ocurrido un error aqui">{error}</AlertInfo>
            )
        }

        if(loading) {
            return <Skeleton />
        } else {
            return (
                <>
                    <Title level={2}>{`Intervenciones realizadas en: ${meeting.name}`}</Title>
                    <Descriptions bordered size="small" title="Información de la reunión">

                        <Descriptions.Item label="ID de la reunión">
                            {meeting.meetingId}
                        </Descriptions.Item>

                        <Descriptions.Item label="Mecanismo de consenso">
                            {meeting.percentage === 0 ? "Usuario validador" : "Votación"}
                            {meeting.percentage !== 0 ? percentageItem() : null }
                        </Descriptions.Item>
                    </Descriptions> 
                </>
            )
        }
    }

    return <>{renderContent()}</>
} 

export default MeetingInfo

import React from  'react'
import { Link } from 'react-router-dom';
import { Table, Spin } from 'antd';
import AlertInfo from '../../../components/AlertInfo'

const MeetingsTable = (props) => {
    const {meetings, loading, error} = props
    console.log(meetings)

    const meetingsTable = meetings.map(
        (meeting) => (
            {
                key: meeting.meetingId,
                date: new Date(meeting.endDate._seconds*1000).toLocaleDateString(),
                action: meeting.meetingId,
                ...meeting
            }
        )
    )

    const columns = [
        { title: 'Reunión', dataIndex: 'name', key: 'name'},
        { title: 'ID de la reunión', dataIndex: 'meetingId', key: 'meetingId', responsive: ['lg']},
        { title: 'Fecha de la reunión', dataIndex: 'date', key: 'date', responsive: ['md']},
        {
            title: 'Ver intervenciones',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <Link to={{
                    pathname:`/dashboard/interventions/${text}`,
                }}>Intervenciones</Link>
            ),
        },
    ];

    const renderMeetings = () => {
        if(error) {
            return <AlertInfo
                        type="error"
                        title="Ha ocurrido un error en el servidor">{error}</AlertInfo>
        }

        if(loading) {
            return <Spin />

        }

        if(meetings.length === 0) {
            return (
                <AlertInfo 
                    type="info"
                    title="No hay reuniones pendientes"/>
            )
        } else {
            return (
                <Table 
                    pagination={true}
                    columns={columns} 
                    dataSource={meetingsTable}/>
            )
        }  
    }
    
    return <>{renderMeetings()}</>
}

export default MeetingsTable
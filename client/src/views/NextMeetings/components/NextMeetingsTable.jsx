import React from  'react'
import { Link } from 'react-router-dom';
import { Table, Spin } from 'antd';
import AlertInfo from '../../../components/AlertInfo'


const NextMeetingsTable = (props) => {
    const { meetings, loading, error } = props

    const meetingsForTable = meetings.map(
        (meeting, index) => (
            {
                key: index,
                start: new Date(meeting.startDate._seconds*1000).toLocaleString(),
                end: new Date(meeting.endDate._seconds*1000).toLocaleString(),
                action: meeting.meetingId,
                ...meeting
            }
        )
    )

    const columns = [
        { title: 'Reunion', dataIndex: 'name', key: 'name'},
        { title: 'Fecha de inicio', dataIndex: 'start', key: 'start', responsive: ['lg'] },
        { title: 'Fecha de finalización', dataIndex: 'end', key: 'end', responsive: ['md'] },
        {   title: 'Consenso', 
            dataIndex: 'percentage', 
            key: 'percentage',
            render: (percentage) => (
                <span>
                    {percentage === 0 ? "Usuario validador" : `Votación - ${percentage}%`}
                </span>
            ),
            responsive: ['md']
        },
        {
            title: 'Entrar',
            dataIndex: 'action',
            key: 'action',
            render: (id) => (
                <Link 
                target="_blank" 
                rel="noopener noreferrer"
                to={`/meetings/${id}`}>Unirse a reunión</Link>
            )
        },
    ];

    const renderContent = () => {
        if(error) {
            return <AlertInfo
                        type="error"
                        title="Ha ocurrido un error">{error}</AlertInfo>
        }

        if(loading) {
            return <Spin />

        }

        if(meetings.length === 0) {
            return (
                <AlertInfo 
                    type="info"
                    title="No hay reuniones en las que haya participado"/>
            )
        } else {
            return (
                <Table 
                    pagination={true}
                    columns={columns} 
                    dataSource={meetingsForTable}/>
            )
        }  
    }

    return <>{renderContent()}</>
}

export default NextMeetingsTable

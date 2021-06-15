import React from  'react'
import { Table, Tag, Typography, Spin } from 'antd';
import { Link } from 'react-router-dom';
import AlertInfo from '../../../components/AlertInfo'
import ValidationsTable from './ValidationsTable'

const { Text } = Typography

const InterventionsTable = (props) => {
    const { interventions, loading, error} = props

    const interventionsForTable = interventions.map(
        (intervention) => (
            {
                key: intervention.ID,
                dateFormatted: new Date(intervention.date._seconds*1000).toLocaleString(),
                ...intervention
            }
        )
    )

    const columns = [
        { title: 'Nombre', dataIndex: 'name', key: 'name'},
        { title: 'ID de la intervención', dataIndex: 'key', key: 'key', responsive: ['lg'] },
        { title: 'Fecha', dataIndex: 'dateFormatted', key: 'dateFormatted', responsive: ['md'] },
        { title: 'Autor', dataIndex: 'author', key: 'author', responsive: ['md'] },
        {   
            title: 'Estado', 
            dataIndex: 'state', 
            key: 'state',
            render: (state) => renderState(state),
            responsive: ['md']
        },
        {   
            title: 'Ver contenido multimedia', 
            key: 'url', 
            dataIndex: 'url', 
            render: (text) => <a href={text} target="_blank">Abrir enlace</a>,
        },
        {
            title: 'Verificar', 
            key: 'verify',
            render: (record) => (renderVerify(record)),
        }
    ];

    const renderVerify = (intervention) => {
        if(intervention.state === 'ACCEPTED') {
            return (
                <Link to={{
                    pathname:`/dashboard/verify/${intervention.ID}`,
                    interventionProps: {
                        ...intervention
                    }
                }}>Verificar</Link>
            )
        } else {
            return <Text disabled>Verificar</Text>
        }
    }

    const renderState = (state) => {
        if(state === 'ACCEPTED') {
            return <Tag color="green">VALIDADO</Tag>
        } else if (state === 'DENIED') {
            return <Tag color="red">DENEGADO</Tag>
        } else {
            return <Tag color="orange">PENDIENTE</Tag>
        }
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
            return <Spin />
        }

        if(interventions.length === 0) {
            return (
                <AlertInfo 
                    type="info"
                    title="No hay intervenciones en esta opción"/>
            )
        } else {
            return (
                <Table
                pagination={true}
                columns={columns} 
                dataSource={interventionsForTable}
                expandable={{
                    expandedRowRender: record => <ValidationsTable intervention={record}/>,
                }}/>
            )
        }
    }

    return(
        <>{renderContent()}</>
    )
}

export default InterventionsTable
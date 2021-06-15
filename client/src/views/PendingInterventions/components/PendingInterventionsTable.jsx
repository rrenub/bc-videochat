import React from 'react';
import { Table, Spin } from 'antd';
import AlertInfo from '../../../components/AlertInfo'

const PendingInterventionsTable = (props) => {
    const { interventions, error, loading } = props

	console.log(interventions)

	const interventionsForTable = interventions.map(
		(intervention) => (
			{ key: intervention.ID, ...intervention }
		)
	)

    const columns = [
        { title: 'Intervención', dataIndex: 'name', key: 'name' },
        { title: 'ID de la intervención', dataIndex: 'ID', key: 'ID', responsive: ['lg']},
        { title: 'Autor de la intervención', dataIndex: 'author', key: 'author', responsive: ['md'] },
        {
		  title: 'Ver contenido multimedia',
          dataIndex: 'url',
          key: 'url',
          render: (text) => (
        	<a href={text} target="_blank">Abrir enlace</a>
          )
        },
    ];

    const renderContent = () => {
        if(error) {
            console.log('error', error)
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
                    title="No hay intervenciones pendientes de validación"/>
            )
        } else {
            return (
                <Table
                    pagination={true}
                    columns={columns} 
                    dataSource={interventionsForTable}
                    rowSelection={{type: 'checkbox', ...props.onSelect}}/>
            )
        }
    }

    return <>{renderContent()}</>
}

export default PendingInterventionsTable;
import React from  'react'
import { Table, Spin, Button, Alert } from 'antd';
import AlertInfo from '../../../components/AlertInfo'

const AdminsTable = (props) => {
    const { admins, loading, error, onDelete } = props

    const columns = [
        { title: 'Administrador', dataIndex: 'email', key: 'email' },
        {
            title: 'Quitar privilegios de administrador',
            dataIndex: 'action',
            key: 'action',
            render: (record, index) => (
                <Button 
                    type="danger"
                    key={index} 
                    onClick={() => onDelete(index)}
                >
                    Eliminar
                </Button>
            )
        },
    ];

    const renderContent = () => {
        if(error) {
            return (
                <AlertInfo
                        type="error"
                        title="Ha ocurrido un error en el servidor">{error}</AlertInfo>
            )
        }

        if(loading) {
            return <Spin />
        }

        return (
            <Table 
                pagination={true}
                columns={columns} 
                dataSource={admins}/>
        )
    }

    return <>{renderContent()}</>
}

export default AdminsTable

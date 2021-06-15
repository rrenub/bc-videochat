import { Table, Badge } from 'antd';
import React from  'react'

const ValidationsTable = ({intervention}) => {   
    const {accepted, denied, pending, state} = intervention;

    const acceptedMap = accepted.map(user => ({
            user: user,
            badge: (<span>
                        <Badge status="success" />
                        Aceptado
                    </span>)
        }
    ))

    const deniedMap = denied.map(user => ({
        user: user,
        badge: (<span>
                    <Badge status="error" />
                    Denegado
                </span>)
        }
    ))

    const pendingMap = pending.map(user => ({
        user: user,
        badge: (<span>
                    {state === 'ACCEPTED' 
                        ? <Badge color="cyan" text="Aceptado por desistimiento positivo"/>
                        : <Badge status="warning" text="Pendiente"/>
                    }
                </span>)
        }
    ))

    const validationsState = [...acceptedMap, ...deniedMap, ...pendingMap]

    const columns = [
        { title: 'Usuario', dataIndex: 'user', key: 'user' },
        { title: 'Estado', dataIndex: 'badge', key: 'badge'}
    ]

    return (
        <Table 
            size="small" 
            columns={columns} 
            dataSource={validationsState} 
            pagination={false} />    
    )
}

export default ValidationsTable;
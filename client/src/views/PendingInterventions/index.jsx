import React, { useEffect, useState } from  'react'
import { Button, Space } from 'antd';
import { validateIntervention } from '../../services/interventionServices'
import useFetch from '../../hooks/use-fetch'
import PendingInterventionsTable from './components/PendingInterventionsTable'
import HeaderText from '../../components/HeaderText'
import '../../App.css'


const PendingInterventions = () => {
    const [ interventions, 
            isLoading, 
            error, 
            fetchInterventions] = useFetch('/interventions/pending')

    const [selected, setSelected] = useState([])
    const [isSelected, setIsSelected] = useState(false)

    useEffect(() => {
        fetchInterventions();
    }, [])

    const handleClickButtons = async (accepted) => {
        console.log(selected)
        setIsSelected(false)
        validateIntervention(accepted, selected).then(() => {
            fetchInterventions();
        })
    }

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          setSelected(selectedRows)
          setIsSelected(selectedRows.length !== 0)
        },
    };


    return (
        <>
            <HeaderText>Intervenciones pendientes de validación</HeaderText>

                <div className="validation_buttons_wrapper">
                    <Space>
                        <Button
                            onClick={() => handleClickButtons(true)}
                            type="primary" 
                            disabled={!isSelected}>Aceptar intervención</Button>
                        <Button 
                            onClick={() => handleClickButtons(false)}
                            type="danger"
                            disabled={!isSelected}>Rechazar intervención</Button>
                    </Space>
                </div>

                <PendingInterventionsTable
                    error={error}
                    loading={isLoading} 
                    interventions={interventions}
                    onSelect={rowSelection}/>
        </>
    )
}

export default PendingInterventions;
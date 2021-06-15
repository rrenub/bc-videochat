import React, { useEffect, useState } from  'react'
import useFetch from '../../hooks/use-fetch'
import { message, Space } from 'antd'
import { deleteAdmin, addAdmin } from '../../services/userServices'
import AdminsTable from './components/AdminsTable'
import HeaderText from '../../components/HeaderText'
import AddAdmin from './components/AddAdmin'

const Admins = () => {
    const [ adminEmail, setAdminEmail ] = useState('')

    const [ 
        admins, 
        isLoading, 
        error,
        fetchAdmins
    ] = useFetch('/users/adminlist')

    useEffect(() => {
        fetchAdmins();
    }, [])

    const onDeleteAdmin = (user) => {
        const { uid } = user
        console.log('quitando privilegios a admin con uid ', uid)
        deleteAdmin(uid).then(() => {
            message.success('Se ha eliminado el administrador correctamente')
            fetchAdmins()
        })
        .catch(error => {
            message.error('No se ha podido realizar la operación')
        })
    }

    const onAddAdmin = async () => {
        console.log('ahi vamos', adminEmail)
        addAdmin(adminEmail).then(() => {
            message.success('Se ha otorgado privilegios de administrador correctamente')
            fetchAdmins()
        }).catch(error => {
            message.error('No se ha podido realizar la operación')
        })
        setAdminEmail('')        
    }

    return (
        <>
            <HeaderText>Gestionar administradores</HeaderText>
                <Space size={10} direction="vertical">

                    <p>Otorgar privilegios de administrador a un usuario puede demorarse</p>

                    <AddAdmin 
                        value={adminEmail}
                        onChangeEmail={(e) => setAdminEmail(e.target.value)}
                        onSubmit={onAddAdmin}/>
                </Space>
                
                <AdminsTable 
                    onDelete={onDeleteAdmin}
                    loading={isLoading}
                    error={error}
                    admins={admins}/>
        </>
    )
}

export default Admins;
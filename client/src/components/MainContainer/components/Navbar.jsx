import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import {
    FileDoneOutlined,
    TeamOutlined,
	InfoCircleOutlined,
	UserOutlined,
} from '@ant-design/icons';
import UserContext from '../../../context/UserContext'

const { SubMenu } = Menu;

const Navbar = (props) => {
	const { isToggled } = props
    const { isAdmin } = useContext(UserContext)
	
    return (
		<> 
		{ !isToggled ? <h2 className='logo'>Aplicación web</h2> : null}

          <Menu theme="dark" mode="inline">

			{/* Opciones cuando el usuario es administrador */}
			
			{ isAdmin 
				? (<SubMenu key="sub1"  title="Administración" icon={<UserOutlined />}>
						<Menu.Item key="3">
							<Link to='/dashboard/create-meeting'>Crear una reunión</Link>
						</Menu.Item>

                        <Menu.Item key="4">
							<Link to='/dashboard/manage'>Administradores</Link>
						</Menu.Item>

						<Menu.Item key="10">
							<Link to='/dashboard/add-user'>Añadir usuario</Link>
						</Menu.Item> 
					</SubMenu>) 
				: null }

				{/* Resto de opciones */}

				<Menu.Item key="6" icon={<TeamOutlined />}>
					<Link to='/dashboard'>Reuniones</Link>
				</Menu.Item>

				<SubMenu key="sub2"  title="Intervenciones" icon={<FileDoneOutlined />}>

					<Menu.Item key="7">
						<Link to='/dashboard/pending-interventions'>Validar</Link>
					</Menu.Item>

					<Menu.Item key="8">
						<Link to='/dashboard/interventions'>Consultar</Link>
					</Menu.Item>

				</SubMenu>

				<Menu.Item key="9" icon={<InfoCircleOutlined />}>
					<Link to='/dashboard/help'>Ayuda</Link>
				</Menu.Item>
				
          	</Menu>
		</>
    )
}

export default Navbar;
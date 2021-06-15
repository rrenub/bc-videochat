import React, { useContext, useEffect, useState } from 'react';
import { Layout, Modal, Drawer } from 'antd'
import { fire } from '../../utils/fire'
import FooterBar from './components/FooterBar'
import HeaderBar from './components/HeaderBar'
import SiderBar from './components/SiderBar'

const { confirm } = Modal
const { Content } = Layout;

const MainContainer = (props) => {
    const [isToggled, setToggled] = useState(false);

    const toggleTrueFalse = () => setToggled(!isToggled);

    const onClose = () => {
        setToggled(false);
    };

    useEffect(() => {
        console.log('esta toogled?', isToggled)
    })

    const onSignOut = () => {
		confirm({
			title: '¿Está seguro de que quiere cerrar sesión?',
			onOk() {
				fire.auth().signOut()
		  	},
		  	onCancel() {
				console.log('Cancel');
		  	},
		});
	}

    return (
        <Layout style={{ minHeight: '100vh'}}>

                <SiderBar 
                    isToggled={isToggled}
                    onClose={onClose}
                    onBreakpoint={toggleTrueFalse}/>

                <Layout>

                    <HeaderBar 
                        isToogled={isToggled}
                        toogleMenu={toggleTrueFalse}
                        onSignOut={onSignOut}/>

                    <Content className="app_content">
                        <div className="app_wrapper">
                            {props.children}
                        </div>
                    </Content>

                    <FooterBar />
                </Layout>
            </Layout>
    );
};

export default MainContainer;
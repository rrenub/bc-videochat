import React from 'react';
import { Layout, Drawer } from 'antd'
import Navbar from './Navbar'

const { Sider } = Layout

const SiderBar = (props) => {
    const { isToggled, onClose, onBreakpoint} = props

    return (
        <>
            {/* Mobile menu */}
            <Drawer
                placement="left"
                onClose={onClose}
                closable={false}
                visible={isToggled}
                className="hideOnDesktop"
                bodyStyle={{ backgroundColor: "#001529", padding: "0" }}>
                    <Navbar isToggled={false}/>
            </Drawer>

            {/* Desktop menu */}
            <Sider
                breakpoint="lg"
                collapsed={isToggled}
                onBreakpoint={(broken) => {
                    onBreakpoint()
                }}
                className="hideOnMobile">
                    <Navbar isToggled={isToggled}/>
            </Sider>
        </>
    );
};

export default SiderBar;
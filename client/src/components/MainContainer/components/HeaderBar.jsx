import React, { useContext } from 'react';
import { Layout, Typography, Space, Button } from 'antd'
import { LogoutOutlined } from '@ant-design/icons';
import UserContext from '../../../context/UserContext'
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined
} from '@ant-design/icons';

const { Header } = Layout;
const { Text } = Typography;

const HeaderBar = (props) => {
    const { onSignOut, isToogled, toogleMenu } = props
    const { name } = useContext(UserContext)

    return (
        <Header className="header_wrapper">

            {isToogled 
                ? <MenuUnfoldOutlined
                    onClick={toogleMenu}/> 
                : <MenuFoldOutlined
                    onClick={toogleMenu}/> 
            }

            <Space size={20}>
                <Text>{name}</Text>
                <Button 
                    type="danger" 
                    shape="circle" 
                    size="small"
                    onClick={onSignOut}
                    icon={<LogoutOutlined />}/>
            </Space>
        </Header>
    );
};

export default HeaderBar;
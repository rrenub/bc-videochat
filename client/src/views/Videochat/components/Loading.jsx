import React from 'react';
import { Spin, Typography, Space } from 'antd'
import '../../../App.css'

const { Title } = Typography

const Loading = () => {
    return (
        <Space size={20} className="loading_meeting">

            <Title>Accediendo a reunión</Title>
            <Spin size="large" />
        </Space>
    );
};

export default Loading;
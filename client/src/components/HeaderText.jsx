import React from 'react';
import { Typography, Divider } from 'antd';

const { Title } = Typography

const HeaderText = (props) => {
    return (
        <>
            <Title level={3}>{props.children}</Title>
            <Divider />
        </>
    )
}

export default HeaderText
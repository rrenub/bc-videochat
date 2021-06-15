import React from 'react';
import { Button, Space, Input } from 'antd'

const AddAdmin = (props) => {
    const { onSubmit, onChangeEmail, value } = props

    return (
        <div>
            <Space direction="horizontal" align="center" size={20}>
                <Input 
                    value={value}
                    placeholder="Email del administrador"
                    onChange={onChangeEmail}
                />
                <Button type="primary" onClick={onSubmit}>Añadir administrador</Button>
            </Space>
        </div>
    );
};

export default AddAdmin;
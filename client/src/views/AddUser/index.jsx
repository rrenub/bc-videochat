import React from 'react';
import { 
    Form, 
    Input, 
    Button, 
    Divider,
    message
} from 'antd';
import { addNewUser } from '../../services/userServices'
import HeaderText from '../../components/HeaderText'

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
};

const tailLayout = {
    wrapperCol: { offset: 4, span: 14 },
};

const handleSubmit = async (values) => {
    console.log(values)
    try {
        await addNewUser(values.email, values.name)
        message.success('Se ha añadido el usuario correctamente')
    } catch(error) {
        message.error('No se ha podido añadir el usuario indicado')
    }
}

const AddUser = () => {
    const [addForm] = Form.useForm();

    return (
        <>
            <HeaderText>Añadir usuario</HeaderText>
            <Divider/>
            <Form
                {...layout}
                form={addForm}
                initialValues={{ admin: false}}
                onFinish={handleSubmit}>

                <Form.Item 
                    label="Nombre del usuario"
                    name="name"
                    rules={[{ required: true}]}>
                    <Input />
                </Form.Item>

                <Form.Item 
                    label="Email"
                    name="email"
                    rules={[{ required: true}]}>
                        <Input />
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        Añadir usuario
                    </Button>
                </Form.Item>
                
            </Form>
        </>
    );
};

export default AddUser;
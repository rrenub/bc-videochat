import React, { useState } from 'react'
import { fire } from  '../../../utils/fire'
import { Form, Input, Button, message, Typography } from 'antd';

const { Title } = Typography

const Login = (props) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = (event) => {
        fire.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                console.log('Logged in correctly')
                message.success(`Se ha iniciado sesión correctamente con el usuario ${email}`)
            })
            .catch((error) => {
                console.error('Incorrect username and password', error)
                message.error('El usuario o la contraseña no son válidos');
            })
    }

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    const tailLayout = {
        wrapperCol: { offset: 3, span: 16 },
    };
      

    return (
        <div className="login-content">
            <Title level={3}>Aplicación web de comunicación multimedia</Title>
                <Form
                    {...layout}
                    name="basic"
                    onFinish={handleSubmit}>
                    <Form.Item
                        label="Usuario"
                        name="username"
                        rules={[{
                                required: true,
                                message: 'Por favor, introduzca su usuario!',
                            }]}>
                        <Input onChange={({target}) => setEmail(target.value)}/>
                    </Form.Item>
                    <Form.Item
                        label="Contraseña"
                        name="password"
                        rules={[{
                                    required: true,
                                    message: 'Por favor, introduzca su contraseña!',
                                }]}>
                        <Input.Password onChange={({target}) => setPassword(target.value)}/>
                    </Form.Item>
                    <Form.Item 
                        {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
        </div>
    )
}

export default Login;
import React, { useRef, useState } from 'react';
import { createMeeting } from '../../services/meetingServices'
import { withRouter } from 'react-router-dom';
import { 
    Form, 
    Input, 
    Button, 
    Radio, 
    DatePicker, 
    Slider, 
    message
} from 'antd';
import HeaderText from '../../components/HeaderText'
import UserInput from './components/UsersInput'

const { RangePicker } = DatePicker;

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
};

const tailLayout = {
    wrapperCol: { offset: 4, span: 14 },
};

const CreationMeeting = (props) => {
    const [form] = Form.useForm();
    
    const [isValidatorNeeded, setIsValidatorNeeded] = useState();
    const [participants, setParticipants] = useState([]);
    const [percentage, setPercentage] = useState(50)

    const percentageFormatter = (value) => `${value}%`

    const calculateNumberOfValidators = Math.ceil(
        participants.length * (percentage / 100)
    )

    const validationInfo = participants.length !== 0 
        ? `Con un porcentaje del ${percentage}, es necesaria la validación de ${calculateNumberOfValidators} usuarios`
        : null
    

    const handleConsensus = (event) => {
        if(event.target.value === "voting") {
            setIsValidatorNeeded(false)
        } else {
            setIsValidatorNeeded(true)
        }
    }

    const onParticipantsChange = (value) => {
        setParticipants(value)
    }

    const onPercentageChange = (value) => {
        setPercentage(value)
    }

    
    const handleSubmit = (values) => {
        const meetingInfo = {
                name: values.name, 
                participants: values.participants,
                startDate: values.date[0],
                endDate: values.date[1],
                validator: values.validator || 'none',
                percentage: values.consensus === 'voting' 
                    ? percentage 
                    : 0
        }
        
        createMeeting({...meetingInfo,})
            .then(() => {
                message.success('Reunión creada correctamente')
                form.resetFields();
            }).catch(err => {
                message.error('Ha ocurrido un error - ', err)
        })
    }

    return(
        <>
        <HeaderText>Crear una reunión</HeaderText>
            <Form
                {...layout}
                form={form}
                initialValues={{ 
                    consensus: "voting", 
                    percentage: 50
                }}
                name="creationMeetingForm"
                onFinish={handleSubmit}>

                <Form.Item 
                    label="Nombre de la reunión"
                    name="name"
                    rules={[{ required: true}]}>
                    <Input />
                </Form.Item>

                <Form.Item 
                    label="Tipo de consenso" 
                    name="consensus"
                    rules={[{ required: true}]}>
                    <Radio.Group onChange={handleConsensus}>
                        <Radio.Button value="voting">Consenso por votación</Radio.Button>
                        <Radio.Button value="validator">Consenso por usuario validador</Radio.Button>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    name="participants"
                    label="Añadir participantes"
                    rules={[{ 
                        required: true, 
                        message: 'Por favor, indique los participantes de la reunión', 
                        type: 'array' }]}>
                    <UserInput 
                        multiple
                        onChange={onParticipantsChange}
                        placeholder="Seleccione los participantes de la reunión"/>
                </Form.Item>

                {
                    isValidatorNeeded 
                    ?   <Form.Item
                            name="validator"
                            label="Usuario validador"
                            rules={[{ required: true, message: 'Por favor, seleccione el usuario validador'}]}>
                            <UserInput 
                                placeholder="Seleccione el usuario validador de la reunión"/>
                        </Form.Item>
                    :  
                        <Form.Item 
                            name="percentage" 
                            label="Porcentaje de votación">
                        <Slider 
                            min={1} 
                            tipFormatter={percentageFormatter} 
                            defaultValue={percentage}
                            onChange={onPercentageChange}/>
                        <span>
                            {validationInfo}
                        </span>
                      </Form.Item>
                }

                <Form.Item name="date" label="Fecha de la reunión">
                    <RangePicker
                        showTime
                        format="YYYY/MM/DD HH:mm"/>                
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>

            </Form>
        </>
    )
}

export default withRouter(CreationMeeting);
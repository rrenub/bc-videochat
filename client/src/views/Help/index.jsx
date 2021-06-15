import React from 'react'
import { Layout, Typography } from 'antd'
import ReactPlayer from "react-player"
import HeaderText from '../../components/HeaderText'

const { Title, Paragraph, Text } = Typography
const { Content } = Layout

const Help = () => {

    return (
        <>
            <HeaderText>Ayuda</HeaderText>
            <Content>
                <div className="content">
                    <Typography>
                        <Paragraph>
                            Aplicación web de comunicación multimedia con sistema de anotación del contenido de 
                            las intervenciones usando la tecnología Blockchain. Esta aplicación es el proyecto 
                            realizado para el Trabajo de Fin de Grado del GITT de la ULPGC.
                        </Paragraph>
                        <Title level={3}>¿Cómo funciona la aplicación?</Title>
                        <Paragraph>
                            Para acceder a una reunión multimedia, en la pestaña <Text code>Reuniones</Text> se muestran las reuniones 
                            sin finalizar. Una vez dentro de la reunión, puede grabar las intervenciones que quiera que sean guardadas.
                        </Paragraph>
                        <Paragraph>
                            Dependiendo del mecanismo de consenso configurado de dicha reunión, dicha intervención debe ser validada 
                            por los usuarios designados según el mecanismo de consenso de la reunión. Puede acceder a las intervenciones 
                            pendientes de validación en la pestaña <Text code>Validar</Text> en <Text code>Intervenciones</Text>).
                        </Paragraph>
                        <Paragraph>
                            Una vez que una intervención sea validada, se procesa y guarda en la blockchain un hash 
                            (identificado criptográfico único de esa intervención), de forma que si la intervención ha sido correctamente 
                            validada, se podrá consultar el contenido de dicha intervención y verificar que no ha sido modificada 
                            o alterada comprobando el hash de la intervención almacenado en la blockchain
                        </Paragraph>
                        <Paragraph>
                            En la pestaña  <Text code>Consultar</Text> en  <Text code>Interventiones</Text>, se pueden consultar 
                            "Mis intervenciones" e "Intervenciones realizadas" en cada reunión a la que haya sido invitado el usuario.
                        </Paragraph>
                    </Typography>
                    <div className="video">
                        <ReactPlayer
                            width='20rem'
                            height='20rem'
                            controls
                            url="https://www.youtube.com/watch?v=2-uV4BSXs0I"
                        />
                        <Text type="secondary" className="video_subtitle">
                                Vídeo mostrando el funcionamiento de la aplicación
                        </Text> 
                    </div>
                </div>
            </Content>
        </>
    )

}

export default Help
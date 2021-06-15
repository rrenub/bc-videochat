import React from 'react';
import { Result, Button } from 'antd';

const NoMatch = (props) => {
    
    const onBack = () => {
        props.history.push('/dashboard')
    }

    return (
        <Result
            status="404"
            title="404"
            subTitle={`No se encuentra la ruta solicitada`}
            extra={
                <Button onClick={onBack} type="primary">Volver al inicio</Button>
            }
        />
    );
};

export default NoMatch;
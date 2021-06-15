import React from 'react'
import { Alert } from 'antd'

const AlertInfo = (props) => {
    const { type, title } = props

    return (
        <Alert
            message={title}
            description={props.children}
            type={type}
            showIcon/>
    )
}

export default AlertInfo;
import React from 'react';
import useGet from '../../../hooks/use-get'
import { Select } from 'antd'

const { Option } = Select

const UsersInput = (props) => {
    const { placeholder, onChange, multiple } = props

    const [ users, 
            loading, 
            error ] = useGet('/users/userlist')

    const renderUsers = () => {
        if(error || loading) {
            return null;
        } else {
            return (
                users.map(user => 
                    <Option 
                        key={user.uid} 
                        value={user.email}>{user.email}
                    </Option> )
                )
        }
    }


    return (
        <div>
            <Select 
                onChange={onChange}
                mode={multiple && 'multiple'}
                loading={loading} 
                placeholder={placeholder}
                onChange={onChange}>
                {renderUsers()}
            </Select>
        </div>
    );
};

export default UsersInput;
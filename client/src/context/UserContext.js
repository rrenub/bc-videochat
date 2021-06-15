import { createContext } from 'react'

const UserContext = createContext({ name: '', isAdmin: false});

export default UserContext
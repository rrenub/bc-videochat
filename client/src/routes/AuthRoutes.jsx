import React, { useContext } from 'react';
import { BrowserRouter as Switch, Redirect, Route } from 'react-router-dom'
import UserContext from '../context/UserContext'

//Routes
import Dashboard from './Dashboard'
import NoMatch from './NoMatch';
import Videochat from '../views/Videochat';

const AuthRoutes = () => {
    const { isAdmin } = useContext(UserContext)

    console.log(isAdmin)

    return (
        <Switch>
            <Route exact path="/" component={() => (<Redirect to='/dashboard'/>)}/>
            <Route path='/dashboard' component={Dashboard} />
            <Route path='/meetings/:id' component={Videochat} />
        </Switch>
    )
};

export default AuthRoutes;
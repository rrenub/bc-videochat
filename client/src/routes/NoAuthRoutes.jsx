import React from 'react';
import { BrowserRouter as Switch, Route } from 'react-router-dom'
import Login from '../views/Login'

const NoAuthRoutes = () => {
    return (
        <Switch>
            <Route path='/' component={Login}/>
        </Switch>
    );
};

export default NoAuthRoutes;
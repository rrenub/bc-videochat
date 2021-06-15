import React, { useContext } from 'react';
import { BrowserRouter as Switch, Route } from 'react-router-dom'
import MainContainer from '../components/MainContainer'
import UserContext from '../context/UserContext'


import Help from '../views/Help'
import Meetings from '../views/Meetings'
import PendingInterventions from '../views/PendingInterventions'
import InterventionVerification from '../views/InterventionVerification'
import Interventions from '../views/Interventions'
import NextMeetings from '../views/NextMeetings'
import Admins from '../views/Admins'
import AddUser from '../views/AddUser'
import CreationMeeting from '../views/CreationMeeting'

const Dashboard = ({match}) => {
    const { isAdmin } = useContext(UserContext)

    return (
            <MainContainer>
                {/* Rutas para cualquier usuario */}
                <Route exact path={match.url} component={NextMeetings}/>
                <Route exact path={`${match.url}/help`} component={Help}/>
                <Route exact path={`${match.url}/pending-interventions`} component={PendingInterventions}/>
                <Route exact path={`${match.url}/interventions/:id`} component={Interventions}/>
                <Route exact path={`${match.url}/interventions`}  component={Meetings}/>
                <Route exact path={`${match.url}/verify/:id`}  component={InterventionVerification}/>

                {/* Rutas de administrador */}
                {isAdmin 
                    ? (<>
                        <Route exact path={`${match.url}/create-meeting`} component={CreationMeeting} />
                        <Route exact path={`${match.url}/manage`} component={Admins}/>
                        <Route exact path={`${match.url}/add-user`} component={AddUser}/>
                    </>)
                : null}
                
            </MainContainer>
    );
};

export default Dashboard;
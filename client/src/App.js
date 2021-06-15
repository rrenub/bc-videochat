import React, { useState } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { fire } from './utils/fire'
import UserContext from './context/UserContext'
import 'antd/dist/antd.css'; 
import './App.css';

//Rutas
import NoAuthRoutes from './routes/NoAuthRoutes'
import AuthRoutes from './routes/AuthRoutes'

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false)
	const [name, setName] = useState('')

	//Comprobación de sesión del usuario
	fire.auth().onAuthStateChanged(async (userRecord) => {
		if(userRecord) {
			console.log(userRecord)
			const token = await userRecord.getIdTokenResult()
			setIsAdmin(token.claims.admin || false)
			setName(userRecord.email)
			setIsLoggedIn(true)
		} else {
			setIsLoggedIn(false)
		}
	})

  	return (
		<Router>
			<UserContext.Provider value={{name, isAdmin}}>
				<Switch>
					{isLoggedIn 
						? <Route component={AuthRoutes}/>
						: <Route component={NoAuthRoutes}/>
					}
				</Switch>
			</UserContext.Provider>
		</Router>
  	);
}

export default App;

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Shorten from './components/Shorten';
import Login from './components/Login';
import CreateAccount from './components/CreateAccount';
import Logout from './components/Logout';
import Home from './components/Home';


ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<BrowserRouter>
				<Routes>
					<Route path='/' element={<Home/>} />
					<Route path='/shorten' element={<Shorten/>} />
					<Route path='/logout' element={<Logout/>} />
					<Route path='/login' element={<Login/>} />
					<Route path='/createaccount' element={<CreateAccount/>} />
				</Routes>
		</BrowserRouter>
	</React.StrictMode>,
);

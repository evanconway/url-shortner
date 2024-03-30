import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SecretMessage from './components/SecretMessage';
import Create from './components/Create';
import View from './components/View';
import UnsafeUsers from './components/UnsafeUsers';
import Login from './components/Login';
import CreateAccount from './components/CreateAccount';


ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<BrowserRouter>
				<Routes>
					<Route path='/' element={<h1>Home</h1>} />
					<Route path='/create' element={<Create/>} />
					<Route path='/view' element={<View/>} />
					<Route path='/secret' element={<SecretMessage/>} />
					<Route path='/users' element={<UnsafeUsers/>} />
					<Route path='/login' element={<Login/>} />
					<Route path='/createaccount' element={<CreateAccount/>} />
				</Routes>
		</BrowserRouter>
	</React.StrictMode>,
);

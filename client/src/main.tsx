import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Link as RRLink, Route, Routes } from 'react-router-dom';
import SecretMessage from './components/SecretMessage';
import Create from './components/Create';
import View from './components/View';
import UnsafeUsers from './components/UnsafeUsers';
import Login from './components/Login';

const Link = (to: string, text: string) => <RRLink style={{ padding: '0 5px' }} to={to}>{text}</RRLink>;

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<BrowserRouter>
			<div>
				<div>
					{Link('/', 'Home')}
					{Link('/create', 'Create')}
					{Link('/view', 'View')}
					{Link('/secret', 'Secret')}
					{Link('/users', 'Users')}
				</div>
				<Routes>
					<Route path='/' element={<h1>Home</h1>} />
					<Route path='/create' element={<Create/>} />
					<Route path='/view' element={<View/>} />
					<Route path='/secret' element={<SecretMessage/>} />
					<Route path='/users' element={<UnsafeUsers/>} />
					<Route path='/login' element={<Login/>} />
				</Routes>
			</div>
		</BrowserRouter>
	</React.StrictMode>,
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import SecretMessage from './components/SecretMessage';

ReactDOM.createRoot(document.getElementById('root')!).render(
  	<React.StrictMode>
		<BrowserRouter>
			<div>
				<Link style={{ padding: '0 5px' }} to='/'>Home</Link>
				<Link style={{ padding: '0 5px' }} to='/login'>Login</Link>
				<Link style={{ padding: '0 5px' }} to='/about'>About</Link>
				<Link style={{ padding: '0 5px' }} to='/secret'>Secret</Link>
				<Routes>
					<Route path='/' element={<h1>Home</h1>} />
					<Route path='/login' element={<h1>Login</h1>} />
					<Route path='/about' element={<h1>About</h1>} />
					<Route path='/secret' element={<SecretMessage/>} />
				</Routes>
			</div>
		</BrowserRouter>
	</React.StrictMode>,
);

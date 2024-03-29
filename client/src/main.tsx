import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  	<React.StrictMode>
		<BrowserRouter>
			<div>
				<Link to='/'>Home</Link>
				<Link to='/login'>Login</Link>
				<Link to='/about'>About</Link>
				<Link to='https://google.com'>Google</Link>
				<Routes>
					<Route path='/' element={<h1>Home</h1>} />
					<Route path='/login' element={<h1>Login</h1>} />
					<Route path='/about' element={<h1>About</h1>} />
				</Routes>
			</div>
		</BrowserRouter>
	</React.StrictMode>,
);

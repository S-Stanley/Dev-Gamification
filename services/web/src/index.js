import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import App from './pages/App'
import HomePage from './pages/account/HomePage'
import RedirectPage from './pages/auth/RedirectPage';
import GraphPage from './pages/graph/GraphPage';
import LoadingPage from './pages/loading/LoadingPage'
import AuthPage from './pages/auth/AuthPage'

ReactDOM.render(
	<BrowserRouter forceRefresh={false}>
		<Routes>
			<Route path='/' element={<App/>} exact={true} />
			<Route path='/home' element={<HomePage/>} exact={true} />
			<Route path='/redirect' element={<RedirectPage/>} exact={true} />
			<Route path='/graph' element={<GraphPage/>} exact={true} />
			<Route path='/loading' element={<LoadingPage/>} exact={true} />
			<Route path='/auth' element={<AuthPage/>} exact={true} />
		</Routes>
	</BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

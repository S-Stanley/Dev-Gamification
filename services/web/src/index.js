import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import HomePage from './pages/account/HomePage';
import RedirectPage from './pages/auth/RedirectPage';
import GraphPage from './pages/graph/GraphPage';
import LoadingPage from './pages/loading/LoadingPage';
import AuthPage from './pages/auth/AuthPage';
import RepoPage from './pages/repo/RepoPage';
import CreateRepoPage from './pages/repo/CreateRepoPage';
import NavigationMenuComponent from './components/NavigationMenuComponent'

ReactDOM.render(
	<BrowserRouter forceRefresh={false}>
		<NavigationMenuComponent/>
		<Routes>
			<Route path='/ladder/:repo_id' element={<HomePage/>} exact={true} />
			<Route path='/redirect' element={<RedirectPage/>} exact={true} />
			<Route path='/graph' element={<GraphPage/>} exact={true} />
			<Route path='/loading' element={<LoadingPage/>} exact={true} />
			<Route path='/auth' element={<AuthPage/>} exact={true} />
			<Route path='/repo' element={<RepoPage/>} exact={true} />
			<Route path='/repo/create' element={<CreateRepoPage/>} exact={true} />
		</Routes>
	</BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

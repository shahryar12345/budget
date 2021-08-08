import React from 'react';
import ReactDOM from 'react-dom';
import "typeface-roboto";
import App from './app';
import * as serviceWorker from './service-worker';
import { BrowserRouter as Router } from 'react-router-dom';

import  store  from './core/_store';
import { Provider } from 'react-redux';

// Per react-app-scripts documentation required for IE11 support
// however the page still refuses to load with no errors
// import 'react-app-polyfill/ie11';
// import 'react-app-polyfill/stable';
// import 'fast-text-encoding/text';

// only way IE11 seems to work
import 'core-js/stable';

ReactDOM.render(
	<Router>
		<Provider store={store}>
			<App />
		</Provider>
	</Router>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

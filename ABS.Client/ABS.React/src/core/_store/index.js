import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../_reducers';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
const initState = {};

const store = createStore(
	rootReducer,
	initState,
	composeWithDevTools(applyMiddleware(thunk))
);

export default store;
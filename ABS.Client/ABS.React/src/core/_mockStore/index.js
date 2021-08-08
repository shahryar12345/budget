import { applyMiddleware, compose, createStore } from 'redux';

import mockInitialState from './initialStates'
import rootReducer from '../_reducers';
import thunk from 'redux-thunk';

const Mockstore = createStore(
	rootReducer,
	mockInitialState,
	compose(applyMiddleware(thunk))
);

export default Mockstore;
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'

import { syncFirebase } from '../firebase'
import rootReducer from './reducers';

let store = createStore(rootReducer, applyMiddleware(thunk));
syncFirebase(store);

export default store;

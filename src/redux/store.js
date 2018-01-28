import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'

import { syncFirebase } from '../firebase'
import reducers from './reducers';

let store = createStore(reducers, applyMiddleware(thunk));
syncFirebase(store);

export default store;

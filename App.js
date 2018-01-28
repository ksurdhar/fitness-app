import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import NavigationApp from './src/index';

class WorkoutApp extends Component {
  render() {
    return (
      <Provider store={store}>
        <NavigationApp />
      </Provider>
    );
  }
}

export default WorkoutApp;

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import WorkoutApp from './WorkoutApp';

class Application extends Component {
  render() {
    return (
      <Provider store={store}>
        <WorkoutApp />
      </Provider>
    );
  }
}

export default Application;

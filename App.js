import React, { Component } from "react"
import { Provider } from "react-redux"
import store from "./src/redux/store"

import Index from "./src/Index"
import { AppLoading, Font, Asset } from 'expo'

class WorkoutApp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isReady: false
    }
  }

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._cacheResourcesAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      )
    } else {
      return (
        <Provider store={store}>
          <Index />
        </Provider>
      )
    }
  }

  async _cacheResourcesAsync() {
    const imagePromise = Asset.fromModule(require('./assets/images/small-logo.png')).downloadAsync()

    await Promise.all([imagePromise, Font.loadAsync({
      'raleway-bold': require('./assets/fonts/Raleway-Bold.ttf'),
      'rubik': require('./assets/fonts/Rubik/Rubik-Medium.ttf'),
      'tajawal3': require('./assets/fonts/tajawal/tajawal3.ttf'),
      'tajawal5': require('./assets/fonts/tajawal/tajawal5.ttf'),
      'roboto-medium': require('./assets/fonts/Roboto/Roboto-Medium.ttf'),
      'mplus': require('./assets/fonts/mplus/MPLUS1p-ExtraBold.ttf')
    })])
  }
}

export default WorkoutApp

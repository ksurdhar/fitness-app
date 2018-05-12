import React from 'react'
import { connect } from 'react-redux'
import {
  ScrollView,
  Animated,
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableWithoutFeedback
} from 'react-native'
// import { Button, Text, Container, Content, Input, Item, Form } from 'native-base'
// import { Col, Row, Grid } from 'react-native-easy-grid'

INITIAL_STATE = {
  text: '',
}

// 50% opacity added for building
COLORS = {
  red: '#B2222250', // firebrick
  blue: '#1E90FF50', // dodgerblue
  gold: '#FFD70050', // gold
  gray: '#77889950', // lightslategray
  white: 'ghostwhite'
}

class DemoScreen extends React.Component {
  static navigationOptions = {
    title: 'DEMO SCREEN',
    tabBarLabel: 'Record',
    tabBarIcon: ({ tintColor }) => (
      <Text>Record</Text>
    )
  }

  constructor() {
    super()
    this.state = INITIAL_STATE

    this.changeTextHandler = this.changeTextHandler.bind(this)
    this.focusHandler = this.focusHandler.bind(this)
    this.blurHandler = this.blurHandler.bind(this)
    this.handleOnTouch = this.handleOnTouch.bind(this)
  }

  resetState() {
    this.setState(INITIAL_STATE)
  }

  // setInput(element) {
  //   console.log('being called')
  //   this.textInput = element
  // }

  submitHandler() {
    console.log('FIRING SUBMIT')
  }

  focusHandler() {
    console.log('focused')
  }

  blurHandler(){
    console.log('blurred')
  }

  handleOnTouch() {
    console.log('on touch!')
    this.textInput && this.textInput.blur()
  }

  changeTextHandler(text) {
    this.setState({text})
  }

// <Animated.View style={{backgroundColor: 'red', flex: 1, height: 100, marginTop: 20}}>
//   <Text>Animate Me!</Text>
// </Animated.View>
// Scrollview will not display "flexed views without a height"
  render() {
    return (
      <View style={{backgroundColor: COLORS.blue, flex: 1}}>
        <TouchableWithoutFeedback
          onPress={this.handleOnTouch}
          style={{flex: 1}}
        >
          <View style={{backgroundColor: COLORS.red, flex: 1, justifyContent: 'space-around'}}>
            <TextInput
              ref={(element) => { this.textInput = element }}
              style={{fontSize: 24, backgroundColor: COLORS.white }}
              placeholder='touch me to animate!'
              value={this.state.text}
              onFocus={this.focusHandler}
              onEndEditing={this.blurHandler}
              onChangeText={this.changeTextHandler}
              onSubmitEditing={this.submitHandler.bind(this)}
            />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={this.handleOnTouch}>
          <View style={{backgroundColor: COLORS.gold, flex: 1}}>
            <Text>Right</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "flex-start",
  },
})
// alignItems: center can be necessary to center views

export default connect(null, null)(DemoScreen)

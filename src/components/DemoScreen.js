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
  white: 'ghostwhite',
  orange: 'rgb(223, 102, 89)',
  clear: 'rgb(0, 0, 0)',
  gray1: 'rgba(64, 77, 91, 0.1)',
  gray3: 'rgba(64, 77, 91, 0.3)',
  gray5: 'rgba(64, 77, 91, 0.5)'
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

  componentDidUpdate() {
    console.log('props', this.props)
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
      <View style={{backgroundColor: COLORS.white, flex: 1, padding: 10}}>
        <TouchableWithoutFeedback
          onPress={this.handleOnTouch}
          style={{flex: 1}}
        >
          <View style={{ flex: 1, justifyContent: 'space-around'}}>
            <View style={{ borderBottomWidth: 3, borderBottomColor: COLORS.gray3 }}>
              <TextInput
                ref={(element) => { this.textInput = element }}
                style={styles.input}
                placeholder='72 reps'
                value={this.state.text}
                onFocus={this.focusHandler}
                onEndEditing={this.blurHandler}
                onChangeText={this.changeTextHandler}
                onSubmitEditing={this.submitHandler.bind(this)}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={this.handleOnTouch}>
          <View style={{flex: 1}}>
            <Text style={{fontFamily: 'raleway-bold', fontSize: 48, color: COLORS.gray1}}>
              Craft Workout
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  input: {
    fontFamily: 'rubik-medium',
    fontSize: 36,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
  },
})

export default connect(null, null)(DemoScreen)

import React from 'react'
import { connect } from 'react-redux'
import {
  ScrollView,
  Animated,
  Button,
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableWithoutFeedback
} from 'react-native'

import KButton from './reusable/button'
import Input from './reusable/input'
import PressCapture from './reusable/pressCapture'
import { common, COLORS } from './reusable/styles'

INITIAL_STATE = {
  text: ''
}

class DemoScreen extends React.Component {
  static navigationOptions = {
    title: 'DEMO SCREEN',
    tabBarLabel: 'Record',
    tabBarIcon: ({ tintColor }) => (
      <Text>Record</Text>
    )
  }

  headerColor = new Animated.Value(0)
  buttonColor = new Animated.Value(0)
  borderColors = {
    top: new Animated.Value(0),
    bottom: new Animated.Value(0),
    left: new Animated.Value(0),
    right: new Animated.Value(0),
    text: new Animated.Value(0)
  }

  constructor() {
    super()
    this.state = INITIAL_STATE

    this.changeTextHandler = this.changeTextHandler.bind(this)
    this.isButtonEnabled = this.isButtonEnabled.bind(this)
    this.handleCapture = this.handleCapture.bind(this)
  }

  resetState() {
    this.setState(INITIAL_STATE)
  }

  componentDidMount() {
    // console.log('component did mount')
  }

  componentDidUpdate() {
    // console.log('props', this.props)
  }

  changeTextHandler(text) {
    this.setState({text})
  }

  handleCapture() {
    this.textInput && this.textInput.blur()
  }

  isButtonEnabled() {
    return this.state.text && this.state.text.length > 0
  }

  render() {
    return (
      <PressCapture onPress={this.handleCapture}>
        <View style={[common.staticView, {marginTop: 70}]}>
          <Input
            value={this.state.text}
            labelText='Name Your Workout:'
            onChangeText={this.changeTextHandler}
            ref={(element) => { this.textInput = element }}
            small={true}
            fixedLabel={true}
          />
          <KButton
            style={{width: 130}}
            value={'>'}
            isEnabled={this.isButtonEnabled()}
          />
        </View>
      </PressCapture>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.gray5,
    padding: 10,
    alignSelf: 'flex-start' // critical to create view width of contents
  }
})

export default connect(null, null)(DemoScreen)

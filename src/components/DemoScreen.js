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

INITIAL_STATE = {
  text: ''
}

COLORS = {
  white: 'ghostwhite',
  orange: 'rgb(223, 102, 89)',
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

  animatedValue = new Animated.Value(0)

  constructor() {
    super()
    this.state = INITIAL_STATE

    this.changeTextHandler = this.changeTextHandler.bind(this)
    this.focusHandler = this.focusHandler.bind(this)
    this.blurHandler = this.blurHandler.bind(this)
    this.handleOnTouch = this.handleOnTouch.bind(this)
  }

  componentDidMount() {
    console.log('component did mount')
  }

  resetState() {
    this.setState(INITIAL_STATE)
  }

  componentDidUpdate() {
    console.log('props', this.props)
  }

  submitHandler() {
    console.log('FIRING SUBMIT')
  }

  focusHandler() {
    Animated.timing(this.animatedValue, {
      toValue: 100,
      duration: 1000
    }).start()
    console.log('focused')
  }

  blurHandler(){
    Animated.timing(this.animatedValue, {
      toValue: 0,
      duration: 1000
    }).start()
    console.log('blurred')
  }

  handleOnTouch() {
    console.log('on touch!')
    this.textInput && this.textInput.blur()
  }

  changeTextHandler(text) {
    this.setState({text})
  }

// Scrollview will not display "flexed views without a height"
  render() {
    console.log('title color',this.state.titleColor)
    const titleColor = this.animatedValue.interpolate({
      inputRange: [0, 100],
      outputRange: ['rgba(64, 77, 91, 0.1)', 'rgba(223, 102, 89, 1.0)']
    })

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
            <Animated.Text style={{fontFamily: 'raleway-bold', fontSize: 48, color: titleColor}}>
              Craft Workout
            </Animated.Text>
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

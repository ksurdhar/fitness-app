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

INITIAL_STATE = {
  text: ''
}

COLORS = {
  white: 'ghostwhite',
  orange: 'rgb(223, 102, 89)',
  gray1: 'rgba(64, 77, 91, 0.1)',
  gray3: 'rgba(64, 77, 91, 0.3)',
  gray5: 'rgba(64, 77, 91, 0.5)',
  gray10: 'rgba(64, 77, 91, 1.0)'
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
  labelPosition = new Animated.Value(0)

  constructor() {
    super()
    this.state = INITIAL_STATE

    this.changeTextHandler = this.changeTextHandler.bind(this)
    this.focusHandler = this.focusHandler.bind(this)
    this.blurHandler = this.blurHandler.bind(this)
    this.handleOnTouch = this.handleOnTouch.bind(this)
    this.handleButtonOnPress = this.handleButtonOnPress.bind(this)
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

  submitHandler() {
    console.log('FIRING SUBMIT')
  }

  focusHandler() {
    Animated.timing(this.labelPosition, {
      toValue: 100,
      duration: 300
    }).start()
    console.log('focused')
  }

  blurHandler(){
    Animated.timing(this.headerColor, {
      toValue: 0,
      duration: 500
    }).start()
    if (!this.state.text || this.state.text.length === 0) {
      Animated.timing(this.labelPosition, {
        toValue: 0,
        duration: 300
      }).start()
    }
    console.log('blurred')
  }

  handleOnTouch() {
    console.log('on touch!')
    this.textInput && this.textInput.blur()
  }

  handleButtonOnPress() {
    console.log('pressed!')
  }

  changeTextHandler(text) {
    if (text.length > 5) {
      Animated.timing(this.headerColor, {
        toValue: 100,
        duration: 500
      }).start()
    }
    this.setState({text})
  }
// UI lessons:
// Scrollview will not display "flexed views without a height"
// TouchableWithoutFeedback does not impact layout and cannot be styled
  render() {
    const titleColor = this.headerColor.interpolate({
      inputRange: [0, 100],
      outputRange: ['rgba(64, 77, 91, 0.1)', 'rgba(223, 102, 89, 1.0)']
    })
    const labelPosition = this.labelPosition.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 42]
    })

    return (
      <View style={{backgroundColor: COLORS.white, flex: 1, padding: 10}}>
        <TouchableWithoutFeedback onPress={this.handleOnTouch}>
          <View style={{ flex: 1, justifyContent: 'space-around'}}>
            <View style={{ borderBottomWidth: 3, borderBottomColor: COLORS.gray3 }}>
              <Animated.Text style={styleLabel(labelPosition)}>
                Name
              </Animated.Text>
              <TextInput
                ref={(element) => { this.textInput = element }}
                style={styles.input}
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
          <View style={{flex: 2}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <TouchableWithoutFeedback onPress={this.handleButtonOnPress}>
                <View style={styleButton()}>
                  <Text style={{fontSize: 36, fontFamily: 'rubik-medium', color: COLORS.gray10, textAlign: 'center'}}>
                    Add exercise
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <Animated.Text style={{fontFamily: 'raleway-bold', fontSize: 48, color: titleColor}}>
              Craft Workout
            </Animated.Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

function styleButton() {
  return {
    backgroundColor: COLORS.white,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopColor: COLORS.gray10,
    borderBottomColor: COLORS.gray10,
    borderLeftColor: COLORS.gray10,
    borderRightColor: COLORS.gray10,
    padding: 10,
    alignSelf: 'flex-start' // critical to create view width of contents
  }
}

function styleLabel(labelPosition) {
  return {
    position: 'absolute',
    fontFamily: 'rubik-medium',
    fontSize: 36,
    color: COLORS.gray3,
    bottom: labelPosition
  }
}

const styles = StyleSheet.create({
  input: {
    fontFamily: 'rubik-medium',
    fontSize: 36,
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
  },
})

export default connect(null, null)(DemoScreen)

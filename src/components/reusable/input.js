import React from 'react'
import {
  Animated,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'
import { COLORS, styleLabel } from './styles'

// DIFFERENT INPUT STATES
// focused, blurred, valid, invalid, filled, empty
class Input extends React.Component {
  labelPosition = new Animated.Value(0)

  constructor(props) {
    super(props)
    this.changeHandler = this.changeHandler.bind(this)
    this.focusHandler = this.focusHandler.bind(this)
    this.blurHandler = this.blurHandler.bind(this)
  }

  componentDidUpdate() {
    // console.log('props', this.props)
  }

  focus() {
    this.textInput.focus()
  }

  blur() {
    this.textInput.blur()
  }

  focusHandler() {
    Animated.timing(this.labelPosition, {
      toValue: 100,
      duration: 300
    }).start()
    console.log('focused')
  }

  blurHandler(){
    if (!this.props.value || this.props.value.length === 0) {
      Animated.timing(this.labelPosition, {
        toValue: 0,
        duration: 300
      }).start()
    }
    console.log('blurred')
    this.props.onEndEditing()
  }

  changeHandler(text) {
    console.log('text changed!', text)
    this.props.onChangeText(text)
  }

  render() {
    const labelPosition = this.labelPosition.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 42]
    })

    return (
      <View style={{ borderBottomWidth: 3, borderBottomColor: COLORS.gray3 }}>
        <Animated.Text style={styleLabel(labelPosition)}>
          {this.props.labelText}
        </Animated.Text>
        <TextInput
          ref={(element) => { this.textInput = element }}
          style={styles.input}
          value={this.props.value}
          onFocus={this.focusHandler}
          onEndEditing={this.blurHandler}
          onChangeText={this.changeHandler}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  input: {
    fontFamily: 'rubik-medium',
    fontSize: 36,
  },
})

export default Input

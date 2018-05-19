import React from 'react'
import {
  Animated,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'
import { COLORS } from './styles'

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

  componentDidMount() {
    if (this.props.value && this.props.value.length > 0) {
      Animated.timing(this.labelPosition, {
        toValue: 100,
        duration: 300
      }).start()
    }
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
    this.props.onEndEditing && this.props.onEndEditing()
    this.blur()
    console.log('blurred')
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
    const size = this.props.small === true ? 'small' : 'large'
    const labelConfig = {
      fontSize: size === 'small' ? 24 : 36,
      labelPosition
    }
    const inputHeight = size === 'small' ? 74 : 90

    return (
      <View style={{ borderBottomWidth: 3, borderBottomColor: COLORS.gray3, height: inputHeight, marginTop:10, marginBottom: 10 }}>
        <Animated.Text style={styleLabel(labelConfig)}>
          {this.props.labelText}
        </Animated.Text>
        <TextInput
          value={this.props.value}
          style={[styles[size], styles.base]}
          placeholder={this.props.placeholder}
          autoFocus={this.props.autoFocus}
          secureTextEntry={this.props.secureTextEntry}
          ref={(element) => { this.textInput = element }}
          onFocus={this.focusHandler}
          onEndEditing={this.blurHandler}
          onChangeText={this.changeHandler}
        />
      </View>
    )
  }
}

function styleLabel(config) {
  return {
    position: 'absolute',
    fontFamily: 'rubik-medium',
    fontSize: config.fontSize,
    color: COLORS.gray3,
    bottom: config.labelPosition
  }
}

const styles = StyleSheet.create({
  base: {
    fontFamily: 'rubik-medium',
  },
  large: {
    fontSize: 36,
    top: 44
  },
  small: {
    fontSize: 24,
    top: 40
  }
})

export default Input

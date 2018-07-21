import React from 'react'
import {
  Animated,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'
import { COLORS } from './common'

// DIFFERENT INPUT STATES
// focused, blurred, valid, invalid, filled, empty
class Input extends React.Component {
  animations = {
    labelPosition: new Animated.Value(0),
    lineColor: new Animated.Value(0)
  }

  constructor(props) {
    super(props)

    this.state = {
      isFocused: false
    }
  }

  componentDidUpdate() {
    console.log(this.props)
  }

  animate() {
    const hasValue = this.props.value && this.props.value.length > 0
    const raiseLabel = this.props.fixedLabel || this.state.isFocused || hasValue
    Animated.timing(this.animations.labelPosition, {
      toValue: raiseLabel? 100: 0,
      duration: 300
    }).start()

    const colorBar = this.state.isFocused
    Animated.timing(this.animations.lineColor, {
      toValue: colorBar? 100 : 0,
      duration: 200
    }).start()
  }

  focus() {
    this.textInput.focus()
  }

  blur() {
    this.textInput.blur()
  }

  focusHandler = () => {
    this.setState({
      isFocused: true
    })
  }

  blurHandler = () => {
    this.setState({
      isFocused: false
    })
    this.props.onEndEditing && this.props.onEndEditing()
  }

  changeHandler = (text) => {
    this.props.onChangeText(text)
  }

  basicInterpolation(colors) {
    return {
      inputRange: [0, 100],
      outputRange: colors
    }
  }

  render() {
    const size = this.props.small === true ? 'small' : 'large'
    const fontSize =  size === 'small' ? 24 : 36
    const inputHeight = size === 'small' ? 74 : 90

    const lineColors = this.props.lineColors
      ? this.props.lineColors
      : [COLORS.gray1, COLORS.gray1]
    const animations = {
      lineColor: this.animations.lineColor.interpolate(
        this.basicInterpolation(lineColors)
      ),
      labelPosition: this.animations.labelPosition.interpolate(
        this.basicInterpolation([0, 42])
      )
    }
    this.animate()

    return (
      <Animated.View style={[{
        borderBottomWidth: 3,
        height: inputHeight,
        marginTop:10,
        marginBottom: 10
      }, styleLine(animations), this.props.style]}>
        <Animated.Text style={styleLabel(animations, fontSize)}>
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
      </Animated.View>
    )
  }
}

function styleLine(animations) {
  return {
    borderBottomColor: animations.lineColor
  }
}

function styleLabel(animations, fontSize) {
  return {
    position: 'absolute',
    fontFamily: 'rubik-medium',
    fontSize: fontSize,
    color: COLORS.gray7,
    bottom: animations.labelPosition
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

import React from 'react'
import {
  Animated,
  StyleSheet,
  TextInput,
  View,
  Text
} from 'react-native'
import { DYNAMIC } from './common'

import AnimatedText from './animatedText'

// DIFFERENT INPUT STATES
// focused, blurred, valid, invalid, filled, empty
class Input extends React.Component {
  animations = {
    labelPosition: new Animated.Value(0),
    greenLine: new Animated.Value(0),
    redLine: new Animated.Value(0),
    baseLine: new Animated.Value(0)
  }

  constructor(props) {
    super(props)

    this.state = {
      isFocused: false,
      interactedWith: false,
    }
  }
  componentDidMount() {
    this.animate()
  }

  componentDidUpdate() {
    this.animate()
  }

  animate = () => {
    const hasValue = this.props.value && this.props.value.length > 0
    const raiseLabel = this.props.fixedLabel || this.state.isFocused || hasValue
    Animated.timing(this.animations.labelPosition, {
      toValue: raiseLabel? 100: 0,
      duration: 300
    }).start()

    let valid, invalid, focused = false
    if (this.props.isValid && !this.props.noValidation) {
      // valid
      valid = true
      invalid = false
      focused = false
    } else if (!this.props.isValid && this.state.interactedWith && !this.props.noValidation) {
      // invalid
      valid = false
      invalid = true
      focused = false
    } else {
      if (this.state.isFocused) {
        // focused
        valid = false
        invalid = false
        focused = true
      }
    }

    if (this.props.animate) {
      Animated.timing(this.animations.baseLine, {
        toValue: focused ? 100 : 0,
        duration: 400
      }).start()

      Animated.timing(this.animations.greenLine, {
        toValue: valid ? 100 : 0,
        duration: 400
      }).start()

      Animated.timing(this.animations.redLine, {
        toValue: invalid ? 100 : 0,
        duration: 400
      }).start()
    }
  }

  focus() {
    this.textInput.focus()
  }

  blur() {
    this.textInput.blur()
  }

  focusHandler = () => {
    console.log('focusing')
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

    if (!this.state.interactedWith) {
      this.setState({ interactedWith: true })
    }
  }

  basicInterpolation(vals) {
    return {
      inputRange: [0, 100],
      outputRange: vals
    }
  }

  render() {
    const labelPosition = Math.ceil(this.props.fontSize * 1.4)
    const animations = {
      greenLine: this.animations.greenLine.interpolate(
        this.basicInterpolation([DYNAMIC.green0, DYNAMIC.green])
      ),
      baseLine: this.animations.baseLine.interpolate(
        this.basicInterpolation([ this.props.invert ? DYNAMIC.white : DYNAMIC.black1, DYNAMIC.link])
      ),
      redLine: this.animations.redLine.interpolate(
        this.basicInterpolation([DYNAMIC.red0, DYNAMIC.red])
      ),
      labelPosition: this.animations.labelPosition.interpolate(
        this.basicInterpolation([this.props.fixedLabel ? labelPosition: 0, labelPosition])
      )
    }

    const maybeRenderSublabel = () => {
      if (this.props.subLabel) {
        return (
          <AnimatedText
            value={this.props.subLabel}
            textColors={['transparent', DYNAMIC.black4]}
            isEnabled={this.state.isFocused}
            style={{ marginLeft: 10, marginTop: 1, fontFamily: 'rubik', fontSize: 18, textAlign: 'center'}}
          />
        )
      } else {
        return null
      }
    }

    return (
      <View>
        <Animated.View style={[{
          borderBottomWidth: 3,
          marginTop:10
        }, styleLine(animations, 'baseLine'), this.props.style]}>
          <Animated.View style={styleLabel(animations)}>
            { this.props.label }
            { maybeRenderSublabel() }
          </Animated.View>
          <TextInput
            value={this.props.value}
            style={[{fontSize: this.props.fontSize}, {
              fontFamily: 'rubik',
              color: this.props.invert ? DYNAMIC.white : DYNAMIC.black
            }]}
            placeholder={this.props.placeholder}
            autoFocus={this.props.autoFocus}
            secureTextEntry={this.props.secureTextEntry}
            multiline={this.props.multiline}
            numberOfLines={this.props.numberOfLines}
            keyboardType={this.props.keyboardType}
            ref={(element) => { this.textInput = element }}
            onFocus={this.focusHandler}
            onEndEditing={this.blurHandler}
            onChangeText={this.changeHandler}
          />
        </Animated.View>
        <Animated.View style={[{borderBottomWidth: 3, top: -3}, styleLine(animations, 'greenLine')]}/>
        <Animated.View style={[{borderBottomWidth: 3, top: -6}, styleLine(animations, 'redLine')]}/>
      </View>
    )
  }
}

function styleLine(animations, lineColor) {
  return {
    borderBottomColor: animations[lineColor]
  }
}

function styleLabel(animations) {
  return {
    position: 'absolute',
    bottom: animations.labelPosition,
    flexDirection: 'row',
    justifyContent: 'left'
  }
}

export default Input

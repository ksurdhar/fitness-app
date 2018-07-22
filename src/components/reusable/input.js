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
    greenLine: new Animated.Value(0),
    redLine: new Animated.Value(0),
    blueLine: new Animated.Value(0)
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
    if (this.props.isValid) {
      // valid
      valid = true
      invalid = false
      focused = false
    } else if (!this.props.isValid && this.state.interactedWith) {
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
      Animated.timing(this.animations.blueLine, {
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
        this.basicInterpolation([COLORS.celestialGreen0, COLORS.celestialGreen])
      ),
      blueLine: this.animations.blueLine.interpolate(
        this.basicInterpolation([COLORS.gray1, COLORS.summerSky])
      ),
      redLine: this.animations.redLine.interpolate(
        this.basicInterpolation([COLORS.fluorescentRed0, COLORS.fluorescentRed])
      ),
      labelPosition: this.animations.labelPosition.interpolate(
        this.basicInterpolation([this.props.fixedLabel ? labelPosition: 0, labelPosition])
      )
    }

    return (
      <View>
        <Animated.View style={[{
          borderBottomWidth: 3,
          marginTop:10
        }, styleLine(animations, 'blueLine'), this.props.style]}>
          <Animated.View style={styleLabel(animations)}>
            { this.props.label }
          </Animated.View>
          <TextInput
            value={this.props.value}
            style={[{fontSize: this.props.fontSize}, styles.base]}
            placeholder={this.props.placeholder}
            autoFocus={this.props.autoFocus}
            secureTextEntry={this.props.secureTextEntry}
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
    bottom: animations.labelPosition
  }
}

// instead of setting sizes, pass in your element and give us a top to animate
const styles = StyleSheet.create({
  base: {
    fontFamily: 'rubik-medium',
  },
})

export default Input

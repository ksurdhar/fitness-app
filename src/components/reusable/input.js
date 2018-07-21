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
  val = 0

  constructor(props) {
    super(props)

    this.state = {
      isFocused: false,
      interactedWith: false,
      prevLineColor: COLORS.gray1,
      newLineColor: COLORS.gray1
    }
  }
  componentDidMount() {
    this.animate()

    const determinedColor = this.determineLineColor()
    if (this.state.newLineColor !== determinedColor) {
      this.setState({
        prevLineColor: this.state.newLineColor,
        newLineColor: determinedColor
      })
    }
  }

  componentDidUpdate() {
    this.animate()

    const determinedColor = this.determineLineColor()
    if (this.state.newLineColor !== determinedColor) {
      this.setState({
        prevLineColor: this.state.newLineColor,
        newLineColor: determinedColor
      })
    }
  }

  animate = () => {
    console.log('animating!')
    const hasValue = this.props.value && this.props.value.length > 0
    const raiseLabel = this.props.fixedLabel || this.state.isFocused || hasValue
    Animated.timing(this.animations.labelPosition, {
      toValue: raiseLabel? 100: 0,
      duration: 300
    }).start()

    let val = this.val
    if (this.state.prevLineColor !== this.state.newLineColor) {
      val = this.val === 100 ? 0 : 100
      this.val = val
    }
    Animated.timing(this.animations.lineColor, {
      toValue: val,
      duration: 1000
    }).start()
  }

  // users either tap to focus, or type to change content

  determineLineColor = () => {
    let color = null
    if (this.props.isValid) {
      color = COLORS.celestialGreen
    } else if (!this.props.isValid && this.state.interactedWith) {
      color = COLORS.fluorescentRed
    } else {
      if (this.state.isFocused) {
        color = COLORS.summerSky
      } else {
        color = COLORS.gray1
      }
    }
    return color
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

  colorInterpolation(colors) {
    let rearrangedColors = [colors[0], colors[1]]
    console.log('rearrangedColors', rearrangedColors)
    if (colors[0] !== colors[1]) {
      rearrangedColors = [colors[1], colors[0]]
    }
    return {
      inputRange: [0, 100],
      outputRange: rearrangedColors
    }
  }

  render() {
    const size = this.props.small === true ? 'small' : 'large'
    const fontSize =  size === 'small' ? 24 : 36
    const inputHeight = size === 'small' ? 74 : 90

    const newColor = this.state.newLineColor ? this.state.newLineColor : COLORS.gray1

    const animations = {
      lineColor: this.animations.lineColor.interpolate(
        this.basicInterpolation([this.state.prevLineColor, newColor])
      ),
      labelPosition: this.animations.labelPosition.interpolate(
        this.basicInterpolation([0, 42])
      )
    }
    //need values

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

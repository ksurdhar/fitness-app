import React from 'react'
import {
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity
} from 'react-native'

import { common, DYNAMIC } from './common'
class Button extends React.Component {
  animations = {
    border: new Animated.Value(0),
    text: new Animated.Value(0),
    background: new Animated.Value(0)
  }

  constructor() {
    super()
    this.handleOnPress = this.handleOnPress.bind(this)
    this.animateButton = this.animateButton.bind(this)
    this.basicInterpolation = this.basicInterpolation.bind(this)
  }

  componentDidMount() {
    // console.log('component did mount')
  }

  animateButton() {
    Animated.parallel([
      Animated.timing(this.animations.background, {
        toValue: this.props.isEnabled? 100 : 0,
        duration: 200
      }),
      Animated.timing(this.animations.text, {
        toValue: this.props.isEnabled? 100 : 0,
        duration: 200
      }),
      Animated.timing(this.animations.border, {
        toValue: this.props.isEnabled? 100 : 0,
        duration: 200
      })
    ]).start()
  }

  handleOnPress() {
    console.log('pressed!')
    this.props.isEnabled && this.props.onPress && this.props.onPress()
  }

  basicInterpolation(colors) {
    return {
      inputRange: [0, 100],
      outputRange: colors
    }
  }

  render() {
    const defaultBackgroundColors = [DYNAMIC.text0, DYNAMIC.link]
    const defaultBorderColors = [DYNAMIC.text1, DYNAMIC.link]
    const defaultTextColors = [DYNAMIC.text1, DYNAMIC.text10]
    const animations = {
      background: this.animations.background.interpolate(
        this.basicInterpolation(defaultBackgroundColors)
      ),
      border: this.animations.border.interpolate(
        this.basicInterpolation(defaultBorderColors)
      ),
      text: this.animations.text.interpolate(
        this.basicInterpolation(defaultTextColors)
      )
    }
    this.animateButton()

    const internalStyle = this.props.transparent ? {
      backgroundColor: 'transparent',
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent',
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
    } : styleButton(animations)

    return (
      <TouchableOpacity onPress={this.handleOnPress}>
        <Animated.View style={[internalStyle, this.props.style]}>
          <Animated.Text style={[{fontSize: 24, fontFamily: 'rubik-medium', color: animations.text, textAlign: this.props.textAlign ? this.props.textAlign : 'center'}, {color: this.props.textColor}]}>
            { this.props.value }
          </Animated.Text>
          { this.props.children }
        </Animated.View>
      </TouchableOpacity>
    )
  }
}

function styleButton(animations) {
  return {
    backgroundColor: animations.background,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopColor: animations.border,
    borderBottomColor: animations.border,
    borderLeftColor: animations.border,
    borderRightColor: animations.border,
    padding: 10,
    alignSelf: 'flex-start' // critical to create view width of contents
  }
}

export default Button

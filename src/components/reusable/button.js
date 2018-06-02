import React from 'react'
import {
  Animated,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native'

import { common, COLORS } from './styles'
class Button extends React.Component {
  borderColors = {
    top: new Animated.Value(0),
    bottom: new Animated.Value(0),
    left: new Animated.Value(0),
    right: new Animated.Value(0),
    text: new Animated.Value(0)
  }
  backgroundColor = new Animated.Value(0)

  constructor() {
    super()
    this.handleOnPress = this.handleOnPress.bind(this)
    this.animateButton = this.animateButton.bind(this)
  }

  componentDidMount() {
    // console.log('component did mount')
    // if (this.props.isEnabled) {
    //   console.log('is enabled! animating!')
    //   console.log('this backgroundColor', this.backgroundColor)
    //   Animated.timing(this.backgroundColor, {
    //     toValue: 100,
    //     duration: 200
    //   }).start()
    // }
  }

  animateButton() {
    Animated.timing(this.backgroundColor, {
      toValue: this.props.isEnabled? 100 : 0,
      duration: 200
    }).start()
  }

  handleOnPress() {
    console.log('pressed!')
    this.props.isEnabled && this.props.onPress && this.props.onPress()
  }

  render() {
    const defaultBorderColors = [COLORS.gray5, COLORS.orange]
    const borderInterpolation = {
      inputRange: [0, 100],
      outputRange: defaultBorderColors
    }
    const borderColors = {
      top: this.borderColors.top.interpolate(borderInterpolation),
      right: this.borderColors.right.interpolate(borderInterpolation),
      left: this.borderColors.left.interpolate(borderInterpolation),
      bottom: this.borderColors.bottom.interpolate(borderInterpolation),
      text: this.borderColors.text.interpolate(borderInterpolation)
    }
    const defaultBackgroundColors = [COLORS.gray0, COLORS.orange]
    const backgroundColor = this.backgroundColor.interpolate({
      inputRange: [0, 100],
      outputRange: defaultBackgroundColors
    })

    this.animateButton()

    return (
      <TouchableWithoutFeedback onPress={this.handleOnPress}>
        <Animated.View style={[styleButton(borderColors, backgroundColor), this.props.style]}>
          <Animated.Text style={{fontSize: 24, fontFamily: 'rubik-medium', color: borderColors.text, textAlign: 'center'}}>
            { this.props.value }
          </Animated.Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }
}

function styleButton(borderColors, backgroundColor) {
  return {
    backgroundColor,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopColor: borderColors.top,
    borderBottomColor: borderColors.bottom,
    borderLeftColor: borderColors.left,
    borderRightColor: borderColors.right,
    padding: 10,
    alignSelf: 'flex-start' // critical to create view width of contents
  }
}

const styles = StyleSheet.create({
  border: {
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 4,
  },
  bordered: {
    backgroundColor: COLORS.white,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopColor: COLORS.gray10,
    borderBottomColor: COLORS.gray10,
    borderLeftColor: COLORS.gray10,
    borderRightColor: COLORS.gray10,
  },
})

export default Button

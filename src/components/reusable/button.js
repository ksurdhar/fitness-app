import React from 'react'
import {
  Animated,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native'

import { commonStyles, COLORS } from './styles'
class Button extends React.Component {
  borderColors = {
    top: new Animated.Value(0),
    bottom: new Animated.Value(0),
    left: new Animated.Value(0),
    right: new Animated.Value(0),
    text: new Animated.Value(0)
  }

  constructor() {
    super()
    this.handleOnPress = this.handleOnPress.bind(this)
  }

  componentDidMount() {
    // console.log('component did mount')
  }

  handleOnPress() {
    console.log('pressed!')
    this.props.onPress && this.props.onPress()
  }

  render() {
    const borderInterpolation = {
      inputRange: [0, 100],
      outputRange: [COLORS.gray5, COLORS.gray0]
    }
    const borderColors = {
      top: this.borderColors.top.interpolate(borderInterpolation),
      right: this.borderColors.right.interpolate(borderInterpolation),
      left: this.borderColors.left.interpolate(borderInterpolation),
      bottom: this.borderColors.bottom.interpolate(borderInterpolation),
      text: this.borderColors.text.interpolate(borderInterpolation)
    }

    return (
      <TouchableWithoutFeedback onPress={this.handleOnPress}>
        <Animated.View style={[styleButton(borderColors), this.props.style]}>
          <Animated.Text style={{fontSize: 24, fontFamily: 'rubik-medium', color: borderColors.text, textAlign: 'center'}}>
            { this.props.value }
          </Animated.Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }
}

function styleButton(borderColors) {
  return {
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

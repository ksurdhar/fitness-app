import React from 'react'
import { Animated } from 'react-native'

import { common, COLORS } from './common'
class AnimatedText extends React.Component {
  animations = {
    text: new Animated.Value(0),
  }

  constructor() {
    super()
  }

  animate = () => {
    Animated.timing(this.animations.text, {
      toValue: this.props.isEnabled? 100 : 0,
      duration: 200
    }).start()
  }

  basicInterpolation = (colors) => {
    return {
      inputRange: [0, 100],
      outputRange: colors
    }
  }

  render() {
    const textColors = this.props.textColors ? this.props.textColors : [COLORS.gray1, COLORS.gray10]
    const animations = {
      text: this.animations.text.interpolate(
        this.basicInterpolation(textColors)
      )
    }
    this.animate()

    return (
      <Animated.Text style={[{color: animations.text}, this.props.style]}>
        { this.props.value }
      </Animated.Text>
    )
  }
}

export default AnimatedText

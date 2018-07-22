import React from 'react'
import { Animated, View } from 'react-native'

import { common, COLORS } from './common'
class AnimatedIcon extends React.Component {
  animations = {
    icon1: new Animated.Value(0),
    icon2: new Animated.Value(0),
  }

  animate = () => {
    Animated.timing(this.animations.icon1, {
      toValue: this.props.isEnabled? 0 : 100,
      duration: 200
    }).start()
    Animated.timing(this.animations.icon2, {
      toValue: this.props.isEnabled? 100 : 0,
      duration: 200
    }).start()
  }

  basicInterpolation = (values) => {
    return {
      inputRange: [0, 100],
      outputRange: values
    }
  }

  render() {
    const animations = {
      icon1: this.animations.icon1.interpolate(
        this.basicInterpolation([0, 1])
      ),
      icon2: this.animations.icon2.interpolate(
        this.basicInterpolation([0, 1])
      )
    }
    this.animate()

    return (
      <View style={[{width: this.props.size, height: this.props.size}, this.props.style]}>
        <Animated.View style={{opacity: animations.icon1, position: 'absolute', left: 0, top: 0}}>
          { this.props.icon1 }
        </Animated.View>
        <Animated.View style={{opacity: animations.icon2, position: 'absolute', left: 0, top: 0}}>
          { this.props.icon2 }
        </Animated.View>
      </View>
    )
  }
}

export default AnimatedIcon

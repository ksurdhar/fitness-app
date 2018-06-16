import React from 'react'
import { Animated } from 'react-native'

// Taken from https://goshakkk.name/react-native-animated-appearance-disappearance/
class Fade extends React.Component {
  constructor() {
    super()
    this._visibility = new Animated.Value(0)
  }

  componentDidMount() {
    Animated.timing(this._visibility, {
      toValue: 1,
      duration: 300,
    }).start()
  }

  render() {
    const { visible, style, children, ...rest } = this.props

    const containerStyle = {
      opacity: this._visibility.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      transform: [
        {
          scale: this._visibility.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1],
          }),
        },
      ],
    }

    const combinedStyle = [containerStyle, style]
    return (
      <Animated.View style={combinedStyle} {...rest}>
        { children }
      </Animated.View>
    )
  }
}

export default Fade

import React from 'react'
import {
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native'

import { common, COLORS } from './common'
class Toast extends React.Component {
  animations = {
    opacity: new Animated.Value(0),
    height: new Animated.Value(0)
  }

  constructor(props) {
    super(props)

    this.state = {
      isOpen: false,
      message: ''
    }
  }

  componentDidMount() {
    // console.log('component did mount')
    this.animate()

  }

  componentDidUpdate() {
    this.animate()
  }

  animate = () => {
    Animated.parallel([
      Animated.timing(this.animations.opacity, {
        toValue: this.state.isOpen? 100 : 0,
        duration: 220
      }),
      Animated.timing(this.animations.height, {
        toValue: this.state.isOpen? 100 : 0,
        duration: 220
      }),
    ]).start()
  }

  handleOnPress = () => {
    this.props.onPress(this.props.label)
  }

  basicInterpolation = (values) => {
    return {
      inputRange: [0, 100],
      outputRange: values
    }
  }

  open = (message) => {
    if (!this.state.isOpen) {
      this.setState({
        isOpen: true,
        message
      })
      setTimeout(() => {
        this.setState({
          isOpen: false,
          message: ''
        })
      }, 4000)
    }
  }

  render() {
    const { width, height } = Dimensions.get('window')
    // actual min and max value
    const animations = {
      opacity: this.animations.opacity.interpolate(
        this.basicInterpolation([0, 1])
      ),
      height: this.animations.height.interpolate(
        this.basicInterpolation([0, 80])
      )
    }

    return (
      <View style={{zIndex: 10, position: 'absolute'}}>
        <Animated.View style={[{
          paddingTop: 25,
          paddingBottom: 25,
          width: width,
          backgroundColor: COLORS.peach
        }, common.row, animatedStyles(animations)]}>
          <Text style={{fontSize: 18, fontFamily: 'rubik-medium', color: COLORS.white}}>
            { this.state.message }
          </Text>
        </Animated.View>
      </View>
    )
  }
}

function animatedStyles(animations) {
  return {
    opacity: animations.opacity,
    height: animations.height
  }
}

export default Toast

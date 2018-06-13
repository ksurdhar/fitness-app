import React from 'react'
import {
  Text,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native'

import { common, COLORS } from './styles'
class Switch extends React.Component {
  animations = {
    border: new Animated.Value(0),
    background: new Animated.Value(0)
  }

  constructor() {
    super()
    this.state = {
      enabled: false
    }

    this.handleOnPress = this.handleOnPress.bind(this)
    this.animateSwitch = this.animateSwitch.bind(this)
    this.basicInterpolation = this.basicInterpolation.bind(this)
  }

  componentDidMount() {
    // console.log('component did mount')
  }

  animateSwitch() {
    Animated.parallel([
      Animated.timing(this.animations.background, {
        toValue: this.state.enabled? 100 : 0,
        duration: 200
      }),
      Animated.timing(this.animations.border, {
        toValue: this.state.enabled? 100 : 0,
        duration: 200
      })
    ]).start()
  }

  handleOnPress() {
    this.setState({
      enabled: !this.state.enabled
    })
  }

  basicInterpolation(colors) {
    return {
      inputRange: [0, 100],
      outputRange: colors
    }
  }

  render() {
    const defaultBackgroundColors = [COLORS.gray0, COLORS.peach]
    const defaultBorderColors = [COLORS.gray1, COLORS.peach]
    const animations = {
      background: this.animations.background.interpolate(
        this.basicInterpolation(defaultBackgroundColors)
      ),
      border: this.animations.border.interpolate(
        this.basicInterpolation(defaultBorderColors)
      )
    }
    this.animateSwitch()

    return (
      <View key={this.props.label} style={{marginTop: 10, marginBottom: 10}}>
        <TouchableWithoutFeedback onPress={this.handleOnPress}>
          <Animated.View style={[styleSwitch(animations), this.props.style]} />
        </TouchableWithoutFeedback>
        <Text style={{ position: 'absolute', left: 36, fontSize: 24, fontFamily: 'rubik-medium', color: COLORS.gray7, textAlign: 'center'}}>
          { this.props.label }
        </Text>
      </View>
    )
  }
}

function styleSwitch(animations) {
  return {
    width: 10,
    height: 10,
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

export default Switch

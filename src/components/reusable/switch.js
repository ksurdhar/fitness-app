import React from 'react'
import {
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'

import { common, DYNAMIC } from './common'
class Switch extends React.Component {
  animations = {
    border: new Animated.Value(0),
    background: new Animated.Value(0)
  }

  constructor() {
    super()

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
        toValue: this.props.enabled? 100 : 0,
        duration: 200
      }),
      Animated.timing(this.animations.border, {
        toValue: this.props.enabled? 100 : 0,
        duration: 200
      })
    ]).start()
  }

  handleOnPress() {
    this.props.onPress(this.props.label)
  }

  basicInterpolation(colors) {
    return {
      inputRange: [0, 100],
      outputRange: colors
    }
  }

  render() {
    const defaultBackgroundColors = [DYNAMIC.black0, DYNAMIC.link]
    const defaultBorderColors = [DYNAMIC.black1, DYNAMIC.link]
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
        <TouchableOpacity onPress={this.handleOnPress}>
          <Animated.View style={[styleSwitch(animations), this.props.style]} />
        </TouchableOpacity>
        <Text style={{ position: 'absolute', left: 36, bottom: 1, fontSize: 24, fontFamily: 'rubik-medium', color: DYNAMIC.black7, textAlign: 'center'}}>
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

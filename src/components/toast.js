import React from 'react'
import {
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native'
import { connect } from 'react-redux'

import * as toastActions from '../redux/actions/toastActions.js'
import { common, DYNAMIC } from './reusable/common'

// props.toastState.isOpen, toastString, type [success, error]

class Toast extends React.Component {
  animations = {
    opacity: new Animated.Value(0),
    height: new Animated.Value(0)
  }

  componentDidMount() {
    this.animate()
  }

  componentDidUpdate(prevProps, prevState) {
    this.animate()
    if (this.props.toastState.toastString.length > 0 && prevProps.toastState.toastString.length === 0) {
      setTimeout(() => {
        this.props.closeToast()
      }, 3000)
    }
  }

  animate = () => {
    Animated.parallel([
      Animated.timing(this.animations.opacity, {
        toValue: this.props.toastState.toastString.length > 0 ? 100 : 0,
        duration: 220
      }),
      Animated.timing(this.animations.height, {
        toValue: this.props.toastState.toastString.length > 0 ? 100 : 0,
        duration: 220
      }),
    ]).start()
  }

  basicInterpolation = (values) => {
    return {
      inputRange: [0, 100],
      outputRange: values
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
          backgroundColor: DYNAMIC.link
        }, common.row, animatedStyles(animations)]}>
          <Text style={{fontSize: 18, fontFamily: 'rubik-medium', color: DYNAMIC.foreground}}>
            { this.props.toastState.toastString }
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

const mapStateToProps = (state, ownProps) => {
  return {
    toastState: state.toasts,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    closeToast: () => { dispatch(toastActions.closeToast()) },
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Toast)

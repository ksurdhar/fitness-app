import React from 'react'
import {
  TouchableWithoutFeedback
} from 'react-native'

class PressCapture extends React.Component {
  constructor(props) {
    super(props)
    this.handleOnPress = this.handleOnPress.bind(this)
  }

  handleOnPress() {
    console.log('pressed!')
    this.props.onPress && this.props.onPress()
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.handleOnPress}>
        {this.props.children}
      </TouchableWithoutFeedback>
    )
  }
}

export default PressCapture

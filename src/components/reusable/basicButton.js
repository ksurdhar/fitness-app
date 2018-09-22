import React from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native'

import { common, DYNAMIC } from './common'
class BasicButton extends React.Component {
  handleOnPress = () => {
    this.props.onPress && this.props.onPress()
  }

  render() {
    return (
      <TouchableOpacity onPress={this.handleOnPress}>
        <View style={[styleButton(), this.props.style]}>
          { this.props.children }
        </View>
      </TouchableOpacity>
    )
  }
}

function styleButton() {
  return {
    padding: 10,
    alignSelf: 'flex-start' // critical to create view width of contents
  }
}

export default BasicButton

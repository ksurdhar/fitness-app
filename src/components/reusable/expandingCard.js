import React from 'react'
import {
  Dimensions,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text
} from 'react-native'

import { common, COLORS } from './styles'
class ExpandingCard extends React.Component {
  constructor() {
    super()

    this.state = {
      expanded: false
    }
  }

  componentDidMount() {
    // console.log('component did mount')
  }

  handleOnPress = () => {
    console.log('toggling expand!')
    this.setState({
      expanded: !this.state.expanded
    })
  }

  render() {
    const { width } = Dimensions.get('window')

    return (
      <TouchableWithoutFeedback onPress={this.handleOnPress}>
        <View style={styleCard(width)}>
          <View>
            <View style={{ borderBottomColor: COLORS.gray1, borderBottomWidth: 1, marginBottom: 10, top: 64, zIndex: 2}} />
            <View style={{ paddingLeft: 16, paddingRight: 16 }}>
              <Text style={[common.tajawal3, {fontSize: 18, color: COLORS.gray8}]}>{this.props.subHeader}</Text>
              <Text style={[common.tajawal5, {fontSize: 26, color: COLORS.gray10, paddingBottom: 10}]}>{this.props.header}</Text>
              <View>
                { this.props.children }
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

function styleCard(width) {
  return {
    width: width - 30,
    minHeight: 180,
    backgroundColor: COLORS.white,
    marginBottom: 16,
    marginLeft: 6,
    shadowColor: COLORS.gray10,
    shadowOpacity: 0.3,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 2,
    paddingTop: 8,
    paddingBottom: 8,
  }
}

export default ExpandingCard

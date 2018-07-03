import React from 'react'
import {
  Dimensions,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text
} from 'react-native'
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons'

import { common, COLORS } from './styles'
class ExpandingCard extends React.Component {
  animations = {
    height: new Animated.Value(0),
  }

  constructor() {
    super()

    this.state = {
      expanded: false
    }
  }

  animateExpansion() {
    Animated.timing(this.animations.height, {
      toValue: this.state.expanded? 100 : 0,
      duration: 350
    }).start()
  }

  componentDidMount() {
    // console.log('component did mount')
  }

  handleOnPress = () => {
    console.log('toggling expand!', this.state.expanded)
    this.setState({
      expanded: !this.state.expanded
    })
  }

  render() {
    const { width } = Dimensions.get('window')

    const cardHeight = this.animations.height.interpolate({
      inputRange: [0, 100],
      outputRange: [100, 800]
    })

    this.animateExpansion()

    return (
      <View style={styleCard(width, this.state.expanded)}>
        <View>
          <View style={{ borderBottomColor: COLORS.gray1, borderBottomWidth: 1, marginBottom: 10, top: 64, zIndex: 2}} />
          <View style={{ paddingLeft: 16, paddingRight: 16 }}>
            <Text style={[common.tajawal3, {fontSize: 18, color: COLORS.gray8}]}>{this.props.subHeader}</Text>
            <Text style={[common.tajawal5, {fontSize: 26, color: COLORS.gray10, paddingBottom: 10}]}>{this.props.header}</Text>
            <View>
              <Animated.View style={styleExpand(cardHeight)}>
                { this.props.children }
              </Animated.View>
              <View style={[common.row, {marginTop: 10}]}>
                <TouchableWithoutFeedback onPress={this.handleOnPress}>
                  <Feather name="plus-circle" size={32} color={COLORS.gray10}/>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

function styleExpand(cardHeight, expanded) {
  if (expanded) {
    return {}
  } else {
    return {
      minHeight: 100,
      maxHeight: cardHeight,
      overflow: 'hidden'
    }
  }
}

function styleCard(width) {
  return {
    width: width - 30,
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

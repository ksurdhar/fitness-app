import React from 'react'
import {
  Dimensions,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text
} from 'react-native'

import SideSwipe from 'react-native-sideswipe'

import { common, COLORS } from './common'
class CarouselCard extends React.Component {
  constructor() {
    super()

    this.state = {
      carouselIdx: 0
    }
  }

  componentDidMount() {
    // console.log('component did mount')
  }

  handleOnPress = () => {
    console.log('pressed!')
    this.props.isEnabled && this.props.onPress && this.props.onPress()
  }

  renderCarouselIdx = (idx, item) => {
    switch (idx) {
      case 0:
        return this.props.view1
        break
      case 1:
        return this.props.view2
        break
    }
  }

  toggleIdx = () => {
    const newIdx = this.state.carouselIdx === 0 ? 1 : 0
    this.setState({
      carouselIdx: newIdx
    })
  }

  render() {
    const { width } = Dimensions.get('window')

    return (
      <TouchableWithoutFeedback onPress={this.toggleIdx}>
        <View style={styleCard(width)}>
          <View>
            <View style={{ borderBottomColor: COLORS.gray1, borderBottomWidth: 1, marginBottom: 10, top: 64, zIndex: 2}} />
            <View style={{ paddingLeft: 16, paddingRight: 16 }}>
              <Text style={[common.tajawal3, {fontSize: 18, color: COLORS.gray8}]}>{this.props.subHeader}</Text>
              <Text style={[common.tajawal5, {fontSize: 26, color: COLORS.gray10, paddingBottom: 10}]}>{this.props.header}</Text>
              <SideSwipe
                index={this.state.carouselIdx}
                itemWidth={width}
                style={{ width: width - 50 }}
                data={[1,2]}
                useNativeDriver={true}
                onIndexChange={index => {
                  this.setState(() => ({ carouselIdx: index }))
                }}
                renderItem={({ itemIndex, currentIndex, item, animatedValue }) => (
                  <View style={[{ width: width - 20, marginRight: 30}]}>
                    { this.renderCarouselIdx(itemIndex, item) }
                  </View>
                )}
              />
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

export default CarouselCard

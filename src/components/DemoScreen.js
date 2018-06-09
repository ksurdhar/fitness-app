import React from 'react'
import { connect } from 'react-redux'
import {
  ScrollView,
  Dimensions,
  Animated,
  Button,
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableWithoutFeedback
} from 'react-native'
import SideSwipe from 'react-native-sideswipe'

import KButton from './reusable/button'
import Input from './reusable/input'
import PressCapture from './reusable/pressCapture'
import { common, COLORS } from './reusable/styles'

DEMO_STATE = {
  text: '',
  carouselIdx: 0
}

DATA = [{name: 'name exercise'}, {name: 'select attributes'}, {name: 'add or finish'}]

class DemoScreen extends React.Component {
  static navigationOptions = {
    title: 'DEMO SCREEN',
    tabBarLabel: 'Record',
    tabBarIcon: ({ tintColor }) => (
      <Text>Record</Text>
    )
  }

  headerColor = new Animated.Value(0)
  buttonColor = new Animated.Value(0)
  borderColors = {
    top: new Animated.Value(0),
    bottom: new Animated.Value(0),
    left: new Animated.Value(0),
    right: new Animated.Value(0),
    text: new Animated.Value(0)
  }

  constructor() {
    super()
    this.state = DEMO_STATE

    this.changeTextHandler = this.changeTextHandler.bind(this)
    this.isButtonEnabled = this.isButtonEnabled.bind(this)
    this.handleCapture = this.handleCapture.bind(this)
    this.renderCarousel = this.renderCarousel.bind(this)
    this.incrementCarousel = this.incrementCarousel.bind(this)
    this.decrementCarousel = this.decrementCarousel.bind(this)
  }

  resetState() {
    this.setState(DEMO_STATE)
  }

  componentDidMount() {
    // console.log('component did mount')
  }

  componentDidUpdate() {
    // console.log('props', this.props)
  }

  changeTextHandler(text) {
    this.setState({text})
  }

  handleCapture() {
    this.textInput && this.textInput.blur()
  }

  isButtonEnabled() {
    return this.state.text && this.state.text.length > 0
  }

  incrementCarousel() {
    console.log('incrementing')
    if (this.state.carouselIdx + 1 < DATA.length) {
      console.log('safe to increment')
      this.setState({
        carouselIdx: this.state.carouselIdx + 1
      })
    }
  }

  decrementCarousel() {
    console.log('decrementing')
    if (this.state.carouselIdx - 1 >= 0) {
      console.log('safe to decrement')
      this.setState({
        carouselIdx: this.state.carouselIdx - 1
      })
    }
  }

  renderCarousel() {
    const { width } = Dimensions.get('window');
    // const contentOffset = (width - CustomComponent.WIDTH) / 2;
    console.log('THIS STATE', this.state)

    return (
      <SideSwipe
        index={this.state.carouselIdx}
        itemWidth={300}
        style={{ width: width, maxHeight: 255}}
        data={DATA}
        contentOffset={20}
        useNativeDriver={true}
        onIndexChange={index => {
          console.log('changing state!', index)
          this.setState(() => ({ carouselIdx: index }))
        }}
        renderItem={({ itemIndex, currentIndex, item, animatedValue }) => (
          <View style={{width: 300, height: 100, backgroundColor: COLORS.gray7}}>
            <Text style={{color: COLORS.white}}>
            { item.name }
            </Text>
          </View>
        )}
      />
    )
  }

  render() {
    return (
        <View style={[common.staticView, {marginTop: 70}]}>
          <View style={{
            height: 220,
            borderBottomWidth: 2,
            borderTopWidth: 2,
            borderTopColor: COLORS.gray1,
            borderBottomColor: COLORS.gray1,
            marginTop: 150,
            paddingTop: 20
          }}>
            <Input
              value={this.state.text}
              labelText='Name Your Workout:'
              onChangeText={this.changeTextHandler}
              ref={(element) => { this.textInput = element }}
              small={true}
              fixedLabel={true}
              style={{marginBottom: 20}}
            />
            <View style={[common.row, {justifyContent: 'space-around'}]}>
              <KButton
                style={{width: 100, padding: 4}}
                value={'<'}
                isEnabled={this.isButtonEnabled()}
                onPress={ () => this.decrementCarousel() }
              />
              <KButton
                style={{width: 100, padding: 4}}
                value={'>'}
                isEnabled={this.isButtonEnabled()}
                onPress={ () => this.incrementCarousel() }
              />
            </View>
          </View>
          { this.renderCarousel() }
        </View>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.gray5,
    padding: 10,
    alignSelf: 'flex-start' // critical to create view width of contents
  }
})

export default connect(null, null)(DemoScreen)

import React from 'react'
import { connect } from 'react-redux'
import {
  Animated,
  StyleSheet,
  TextInput,
} from 'react-native'
import { Button, Text, Container, Content, Input, Item } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'

INITIAL_STATE = {
  text: '',
}

class DemoScreen extends React.Component {
  static navigationOptions = {
    title: 'DEMO SCREEN',
    tabBarLabel: 'Record',
    tabBarIcon: ({ tintColor }) => (
      <Text>Record</Text>
    )
  }

  constructor() {
    super()
    this.state = INITIAL_STATE
    this.changeTextHandler = this.changeTextHandler.bind(this)
    this.focusHandler = this.focusHandler.bind(this)
    this.blurHandler = this.blurHandler.bind(this)
  }

  resetState() {
    this.setState(INITIAL_STATE)
  }

  submitHandler() {
    console.log('FIRING SUBMIT')
  }

  focusHandler() {
    console.log('focused')
  }

  blurHandler(){
    console.log('blurred')
  }

  changeTextHandler(text) {
    this.setState({text})
  }

//   <Input
//     ref={this}
//     style={{fontSize: 24}}
//     underline
//     placeholder='Workout name ex. Leg Blasters'
//     value={this.state.text}
//     onFocus={this.focusHandler}
//     onBlur={this.blurHandler}
//     onChangeText={this.changeTextHandler}
//     onSubmitEditing={this.submitHandler.bind(this)}
//   />
// </Item>
// <Animated.View style={{backgroundColor: 'red', flex: 1, height: 100, marginTop: 20}}>
//   <Text>Animate Me!</Text>
// </Animated.View>

  render() {
    return (
      <Container>
        <Content padder contentContainerStyle={styles.content}>
          <Grid>
            <Row size={2} style={{backgroundColor: 'lavender'}}>
              <Text>Left</Text>
            </Row>
            <Row size={1}style={{backgroundColor: 'gold'}}>
              <Text>Right</Text>
            </Row>
          </Grid>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "flex-start",
  },
})
// alignItems: center can be necessary to center views

export default connect(null, null)(DemoScreen)

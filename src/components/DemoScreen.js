import React from 'react'
import { connect } from 'react-redux'
import {
  Animated,
  StyleSheet,
  TextInput,
  View,
  TouchableWithoutFeedback
} from 'react-native'
import { Button, Text, Container, Content, Input, Item, Form } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'

INITIAL_STATE = {
  text: '',
}

// 50% opacity added for building
COLORS = {
  red: '#B2222250', // firebrick
  blue: '#1E90FF50', // dodgerblue
  gold: '#FFD70050', // gold
  gray: '#77889950', // lightslategray
  white: 'ghostwhite'
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

  handleOnTouch = (test) => {
    console.log('TOUCHED')
  }

  handleInputRef = (ref) => {
    this.input = ref
  }


// <Animated.View style={{backgroundColor: 'red', flex: 1, height: 100, marginTop: 20}}>
//   <Text>Animate Me!</Text>
// </Animated.View>
// Test adding a Form element - the input is effectively swallowing up the whole row and capturing its events
  render() {
    return (
      <Container>
        <Content padder contentContainerStyle={styles.content}>
          <Grid>
            <Row size={1} style={{backgroundColor: COLORS.blue }}/>
            <Row size={1} style={{backgroundColor: COLORS.red, flexDirection: 'column' }}>
            <TouchableWithoutFeedback onPress={this.handleOnTouch}>
              <Item style={{flex: 1, backgroundColor: COLORS.gold }}>
                <Input
                  ref={this.handleInputRef}
                  style={{fontSize: 24, backgroundColor: COLORS.white }}
                  placeholder='touch me to animate!'
                  value={this.state.text}
                  onFocus={this.focusHandler}
                  onBlur={this.blurHandler}
                  onChangeText={this.changeTextHandler}
                  onSubmitEditing={this.submitHandler.bind(this)}
                  />
                </Item>
              </TouchableWithoutFeedback>
            </Row>
            <Row size={1} style={{backgroundColor: COLORS.blue }}/>
            <TouchableWithoutFeedback onPress={this.handleOnTouch}>
              <Row size={1} style={{backgroundColor: COLORS.red }}>
                <Text>Right</Text>
              </Row>
            </TouchableWithoutFeedback>
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

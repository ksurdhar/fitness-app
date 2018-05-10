import React from 'react'
import { connect } from 'react-redux'
import {
  Animated,
  StyleSheet,
  TextInput,
} from 'react-native'
import { Button, Text, Container, Content, Input, Item } from 'native-base'

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

  render() {
    return (
      <Container style={{flex: 1}}>
        <Content style={{flex: 1}} contentContainerStyle={styles.container}>
          <Item style={{marginLeft:15, marginRight: 15}}>
            <Input
              ref={this}
              style={{fontSize: 24}}
              underline
              placeholder='Workout name ex. Leg Blasters'
              value={this.state.text}
              onFocus={this.focusHandler}
              onBlur={this.blurHandler}
              onChangeText={this.changeTextHandler}
              onSubmitEditing={this.submitHandler.bind(this)}
            />
          </Item>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
})

export default connect(null, null)(DemoScreen)

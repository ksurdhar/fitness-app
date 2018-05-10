import React from 'react'
import { connect } from 'react-redux'
import produce from 'immer'
import {
  StyleSheet,
  TextInput,
} from 'react-native'
import { Button, Text, Container, Content, Input, Item } from 'native-base'

INITIAL_STATE = {
  workoutName: '',
}

class NameWorkoutScreen extends React.Component {
  static navigationOptions = {
    title: 'Define Workout',
    tabBarLabel: 'Record',
    tabBarIcon: ({ tintColor }) => (
      <Text>Record</Text>
    )
  }

  constructor() {
    super()
    this.state = INITIAL_STATE
    this.changeTextHandler = this.changeTextHandler.bind(this)
  }

  resetState() {
    this.setState(INITIAL_STATE)
  }

  addExercises() {
    this.props.navigation.navigate('AddWorkout', {
      workoutID: null,
      workoutName: this.state.workoutName,
      exerciseData: {0: {0: {type: null, val: null}}},
      exerciseNames: ['']
    })
  }

  changeTextHandler(workoutName) {
    // if state workout name has no length, add one class, otherwise add another
    this.setState({workoutName})
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
              value={this.state.workoutName}
              onChangeText={this.changeTextHandler}
              onSubmitEditing={this.addExercises.bind(this)}
            />
          </Item>
        </Content>
      </Container>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
})

export default connect(mapStateToProps, null)(NameWorkoutScreen)

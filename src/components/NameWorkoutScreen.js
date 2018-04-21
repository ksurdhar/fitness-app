import React from 'react'
import { connect } from 'react-redux'
import produce from 'immer'
import {
  StyleSheet,
  Text,
  Button,
  TextInput,
  View,
} from 'react-native'

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

  render() {
    return (
      <View style={{flex: 1}}>
        <TextInput
          placeholder='Workout Name ex. Legs'
          style={styles.input}
          ref='workoutInput'
          value={this.state.workoutName}
          onChangeText={(workoutName) => this.setState({workoutName})}
          onEndEditing={() => this.refs.workoutInput.blur()}
        />
        <Button
          onPress={() => {this.addExercises()}}
          title='Add Exercises'
        />
      </View>
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
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 40,
    marginTop: 60,
    marginBottom: 60,
  },
  input: {
    backgroundColor: '#FFFFFF',
    height: 42,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 10,
    borderRadius: 5,
    fontSize: 20,
    width: 320,
  },
})

export default connect(mapStateToProps, null)(NameWorkoutScreen)

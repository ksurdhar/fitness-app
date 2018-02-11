import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, ScrollView, Button, TextInput, Keyboard, View } from 'react-native';
import * as workoutActions from '../redux/actions/workoutActions';

INITIAL_STATE = {
  workoutName: '',
  inputNumber: 1,
}

class RecordScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Record',
    tabBarIcon: ({ tintColor }) => (
      <Text>Record</Text>
    )
  };

  constructor() {
    super()
    this.state = INITIAL_STATE
  }

  resetState() {
    this.setState(INITIAL_STATE)
  }

  addWorkout() {
    this.props.addWorkout(
      this.state.workoutName,
      this.state.input1Text,
      this.props.user.uid
    );
    this.resetState()
    this.props.navigation.navigate('Workouts')
    Keyboard.dismiss()
  }

  // state: inputs { 0: { text: 'blah' } }
  // then add attributes
  // reps, sets, weight, time

  renderExerciseInputs() {
    const inputs = []
    for (x = 0; x < this.state.inputNumber; x++) {
      inputs.push(
        <TextInput
          placeholder='exercise name'
          style={styles.input}
          key={`input${x}`}
          ref={`input${x}`}
          value={this.state[`input${x}Text`]}
          onChangeText={ (exerciseName) => this.setState({ [`input${x}Text`]: exerciseName }) }
        />
      )
    }
    return (
      <View>{ inputs }</View>
    )
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Record Workout</Text>
        <TextInput
          placeholder='ex. Legs'
          style={styles.input}
          ref='firstInput'
          value={this.state.workoutName}
          onChangeText={(workoutName) => this.setState({workoutName})}
          onEndEditing={() => this.refs.firstInput.blur()}
        />
        { this.renderExerciseInputs() }
        <Button
          onPress={() => {this.addWorkout()}}
          title='Create'
        />
      </ScrollView>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addWorkout: (workoutName, exerciseName, uid) => { dispatch(workoutActions.addWorkout(workoutName, exerciseName, uid)); },
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 10,
    borderRadius: 5,
    fontSize: 20,
    width: 300,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(RecordScreen);

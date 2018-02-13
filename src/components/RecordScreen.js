import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, ScrollView, Button, TextInput, Keyboard, View } from 'react-native';
import * as workoutActions from '../redux/actions/workoutActions';

INITIAL_STATE = {
  workoutName: '',
  inputValues: [],
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
      this.state.inputValues,
      this.props.user.uid
    );
    this.resetState()
    this.props.navigation.navigate('Workouts')
    Keyboard.dismiss()
  }

  addInput() {
    this.setState((prevState) => {
      return {
        inputValues: [...prevState.inputValues, '']
      }
    })
  }

  handleInputChange(idx, value) {
    console.log('value', value)
    let inputValues = [...this.state.inputValues]
    inputValues[idx] = value
    this.setState({ inputValues })
  }

  renderExerciseInputs() {
    const inputs = this.state.inputValues.map((val, idx) => {
      return (
        <TextInput
          placeholder='exercise name'
          style={styles.input}
          key={idx}
          value={val || ''}
          onChangeText={ this.handleInputChange.bind(this, idx) }
        />
      )
    })

    return (<View>{ inputs }</View>)
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
          onPress={() => {this.addInput()}}
          title='Add Exercise'
        />
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
    addWorkout: (workoutName, exerciseNames, uid) => { dispatch(workoutActions.addWorkout(workoutName, exerciseNames, uid)); },
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

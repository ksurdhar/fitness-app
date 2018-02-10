import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, ScrollView, Button, TextInput, Keyboard } from 'react-native';
import * as workoutActions from '../redux/actions/workoutActions';

class RecordScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Record',
    tabBarIcon: ({ tintColor }) => (
      <Text>Record</Text>
    )
  };

  constructor() {
    super()

    this.state = {
      workoutName: '',
      exerciseName: '',
    }
  }

  addWorkout() {
    this.props.addWorkout(
      this.state.workoutName,
      this.state.exerciseName,
      this.props.user.uid
    );
    this.setState({ workoutName: '', exerciseName: '' });
    this.props.navigation.navigate('Workouts')
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Record Workout</Text>
        <TextInput
          placeholder="ex. Legs"
          style={styles.input}
          ref='firstInput'
          value={this.state.workoutName}
          onChangeText={(workoutName) => this.setState({workoutName})}
          onSubmitEditing={() => this.refs.secondInput.focus()}
          onEndEditing={() => this.refs.firstInput.blur()}
        />
        <TextInput
          placeholder="ex. Squats"
          style={styles.input}
          ref='secondInput'
          value={this.state.exerciseName}
          onChangeText={(exerciseName) => this.setState({exerciseName})}
          onEndEditing={() => this.refs.secondInput.blur()}
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

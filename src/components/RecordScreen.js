import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, ScrollView, Button, TextInput } from 'react-native';
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
      workoutName: ''
    }
  }

  addWorkout() {
    this.props.addWorkout(this.state.workoutName, this.props.user.uid);
    this.setState({workoutName: ''});
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Record Workout</Text>
        <TextInput
          placeholder="ex. squats"
          style={styles.input}
          ref="newWorkout"
          value={this.state.workoutName}
          onChangeText={(workoutName) => this.setState({workoutName})}
          onSubmitEditing={() => this.addWorkout()} />
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
    addWorkout: (name, uid) => { dispatch(workoutActions.addWorkout(name, uid)); },
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

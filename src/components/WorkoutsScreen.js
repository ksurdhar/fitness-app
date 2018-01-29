import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import * as workoutActions from '../redux/actions/workoutActions';

class WorkoutsScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Workouts',
    tabBarIcon: ({ tintColor }) => (
      <Text>Workouts</Text>
    )
  };

  constructor() {
    super()

    this.state = {
      workoutName: ''
    }
  }

  mockAction() {
    this.props.mockAction();
  }

  addWorkout() {
    this.props.addWorkout(this.state.workoutName);
    this.setState({workoutName: ''});
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          onPress={() => this.mockAction()}
          title="Update Message"
        />
        <Text>{this.props.message}</Text>
        <TextInput placeholder="ex. squats"
                 style={styles.nameInput}
                 ref="newWorkout"
                 value={this.state.workoutName}
                 onChangeText={(workoutName) => this.setState({workoutName})}
                 onSubmitEditing={() => this.addWorkout()} />
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    message: state.workouts.message
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addWorkout: (name) => { dispatch(workoutActions.addWorkout(name)); },
    mockAction: () => { dispatch(workoutActions.mockAction()); }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  nameInput: {
    backgroundColor: '#FFFFFF',
    height: 42,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 10,
    borderRadius: 5,
    fontSize: 20
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkoutsScreen);

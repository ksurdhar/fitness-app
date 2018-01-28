import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as workoutActions from '../redux/actions/workoutActions';

class WorkoutsScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Workouts',
    tabBarIcon: ({ tintColor }) => (
      <Text>Workouts</Text>
    )
  };

  mockAction() {
    this.props.mockAction();
  }

  addWorkout() {
    this.props.addWorkout('pushups');
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          onPress={() => this.mockAction()}
          title="Update Message"
        />
        <Text>{this.props.message}</Text>
        <Button
          onPress={() => this.addWorkout()}
          title="Add Workout"
        />
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
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkoutsScreen);

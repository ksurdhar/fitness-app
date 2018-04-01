import React from 'react';
import { connect } from 'react-redux';
import produce from 'immer';
import {
  StyleSheet,
  Text,
  ScrollView,
  Button,
  TextInput,
  Keyboard,
  View,
  Picker,
} from 'react-native';
import * as workoutActions from '../redux/actions/workoutActions';
import { Dropdown } from 'react-native-material-dropdown';

INITIAL_STATE = {
  workoutName: '',
  inputValues: [],
  exerciseData: {},
  newWorkout: null,
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

  componentDidUpdate() {
    // console.log('state',this.state)
    // console.log('props', this.props)
  }

  recordSession(workoutName, idx) {
    const workoutKey = Object.keys(this.props.workouts)[idx]
    const workout = this.props.workouts[workoutKey]

    const exerciseData = {}
    const exerciseNames = []
    Object.entries(workout.exercises).forEach((exerciseEntry, eIdx) => {
      const exercise = exerciseEntry[1]
      exerciseData[eIdx] = {}
      exercise.attributes.forEach((attr, attrIdx) => {
        exerciseData[eIdx][attrIdx] = attr
      })
      exerciseNames.push(exercise.name)
    })

    this.props.navigation.navigate('EditWorkout', {
      workoutName: workout.name,
      isRecording: true,
      exerciseData: exerciseData,
      exerciseNames: exerciseNames
    })
  }

  renderWorkoutDropdown() { // DOES NOTHING CURRENTLY
    // const workoutNames = Object.entries(this.props.workouts).map((workoutEntry, workoutIdx) => {
    //   return { value: workoutEntry[1].name }
    // })
    //
    // if (workoutNames.length > 0) {
    //   const dropDown = (
    //     <View style={{ flexDirection: 'row' }}>
    //       <View style={{ flex: 1 }}>
    //         <Dropdown
    //           label='Workout Type'
    //           data={workoutNames}
    //           onChangeText={ this.recordSession.bind(this) }
    //         />
    //       </View>
    //     </View>
    //   )
    //   return dropDown
    // }
    //
    // return null
  }

  defineWorkout() {
    this.props.navigation.navigate('AddWorkout')
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{flex: 1}} contentContainerStyle={styles.container}>
          <Text style={styles.title}>Record Workout</Text>
          <Button
            onPress={() => {this.defineWorkout()}}
            title='Add Workout'
          />
          <Text>Or Choose a workout</Text>
          { this.renderWorkoutDropdown() }
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user,
    workouts: state.workouts.workouts,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addWorkout: (workoutName, exerciseNames, exerciseData, uid) => { dispatch(workoutActions.addWorkout(workoutName, exerciseNames, exerciseData, uid)); },
  };
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
});

export default connect(mapStateToProps, mapDispatchToProps)(RecordScreen);

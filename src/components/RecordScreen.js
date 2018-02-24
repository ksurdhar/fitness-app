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
// gonna prepopulate input values, exercise data


ATTRIBUTE_TYPES = [
  {value: 'sets'},
  {value: 'reps'},
  {value: 'weight'},
  {value: 'seconds'},
]

ATTRIBUTE_VALS = [...Array(100).keys()].map((num) => {
  return {value: num + 1}
})

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
    console.log('state',this.state)
  }

  addWorkout() {
    this.props.addWorkout(
      this.state.workoutName,
      this.state.inputValues,
      this.state.exerciseData,
      this.props.user.uid
    )
    this.resetState()
    this.props.navigation.navigate('Workouts')
    Keyboard.dismiss()
  }

  addInput() {
    let newEIdx = 0 // default when no exercises exist
    if (Object.keys(this.state.exerciseData).length > 0) {
      newEIdx = Object.keys(this.state.exerciseData).length
    }
    this.setState((prevState) => {
      return produce(prevState, (draftState) => {
        draftState.inputValues.push('')
        draftState.exerciseData[newEIdx] = {0: {type: null, val: null}}
      })
    })
  }

  handleInputChange(idx, value) {
    let inputValues = [...this.state.inputValues]
    inputValues[idx] = value
    this.setState({ inputValues })
  }

  setAttrType(eIdx, attrIdx, type) {
    this.setState((prevState) => {
      return produce(prevState, (draftState) => {
        draftState.exerciseData[eIdx][attrIdx].type = type
      })
    })
  }

  setAttrVal(eIdx, attrIdx, val) {
    this.setState((prevState) => {
      return produce(prevState, (draftState) => {
        draftState.exerciseData[eIdx][attrIdx].val = val
      })
    })
  }

  addAttribute(eIdx) {
    const attrIdx = Object.keys(this.state.exerciseData[eIdx]).length
    this.setState((prevState) => {
      return produce(prevState, (draftState) => {
        draftState.exerciseData[eIdx][attrIdx] = {type: null, val: null}
      })
    })
  }

  renderAttributes(exIdx) {
    if (this.state.exerciseData[exIdx]) {
      const dropdowns = Object.entries(this.state.exerciseData[exIdx]).map((attrEntry, attrIdx) => {
        return (
          <View
            key={exIdx + attrIdx}
            style={{flexDirection: 'row'}}
          >
            <View style={{flex: 1}}>
              <Dropdown
                label='Attribute'
                data={ATTRIBUTE_TYPES}
                onChangeText={ this.setAttrType.bind(this, exIdx, attrIdx) }
              />
            </View>
            <View style={{ width: 96, marginLeft: 8}}>
              <Dropdown
                label='Val'
                data={ATTRIBUTE_VALS}
                onChangeText={ this.setAttrVal.bind(this, exIdx, attrIdx) }
              />
            </View>
          </View>
        )
      })

      return (<View>{ dropdowns }</View>)
    } else {
      return null
    }
  }

  renderExerciseInputs() {
    const inputs = this.state.inputValues.map((val, idx) => {
      return (
        <View key={idx}>
          <TextInput
            placeholder={`exercise ${idx + 1}`}
            style={styles.input}
            key={idx}
            value={val || ''}
            onChangeText={ this.handleInputChange.bind(this, idx) }
          />
          { this.renderAttributes(idx) }
          <Button
            title='Add Attribute'
            onPress={() => { this.addAttribute(idx) }}
          />
        </View>
      )
    })

    return (<View>{ inputs }</View>)
  }

  defineWorkout() {
    this.props.navigation.navigate('AddWorkout')
  }

// create new workout button if no workouts exist
  // render() {
  //   return (
  //     <View style={{flex: 1}}>
  //       <ScrollView style={{flex: 1}} contentContainerStyle={styles.container}>
  //         <Text style={styles.title}>Record Workout</Text>
  //         <TextInput
  //           placeholder='workout name ex. Legs'
  //           style={styles.input}
  //           ref='workoutInput'
  //           value={this.state.workoutName}
  //           onChangeText={(workoutName) => this.setState({workoutName})}
  //           onEndEditing={() => this.refs.workoutInput.blur()}
  //         />
  //         { this.renderExerciseInputs() }
  //         <Button
  //           onPress={() => {this.addInput()}}
  //           title='Add Exercise'
  //         />
  //         <Button
  //           onPress={() => {this.addWorkout()}}
  //           title='Create'
  //         />
  //       </ScrollView>
  //     </View>
  //   );
  // }
  // based on state, render either one of two components

  // record session
  // or
  // create new workout (render name input)
  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{flex: 1}} contentContainerStyle={styles.container}>
          <Text style={styles.title}>Record Workout</Text>
          <Button
            onPress={() => {this.defineWorkout()}}
            title='Add Workout'
          />
        </ScrollView>
      </View>
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

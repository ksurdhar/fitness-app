import React from 'react';
import { connect } from 'react-redux';
import { update } from 'immutability-helper';
import { StyleSheet, Text, ScrollView, Button, TextInput, Keyboard, View, Picker } from 'react-native';
import * as workoutActions from '../redux/actions/workoutActions';

INITIAL_STATE = {
  workoutName: '',
  inputValues: [],
  exerciseData: {}
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

  componentDidUpdate() {
    console.log('state',this.state)
  }

  handleInputChange(idx, value) {
    let inputValues = [...this.state.inputValues]
    inputValues[idx] = value
    this.setState({ inputValues })
  }

  addAttribute(idx) {
    this.setState((prevState) => {
      const newExerciseData = Object.assign({}, prevState.exerciseData, {
        [idx]: [{type: 'sets', value: null}]
      })
      return {
        exerciseData: newExerciseData
      }
    })
  }

  setAttrType(eIdx, attrIdx, value) {
    console.log('PICKER VALUES', eIdx, attrIdx, value)
    // this.setState((prevState) => {
    //   // const newExerciseData = Object.assign({}, prevState.exerciseData, {
    //   //   [idx]: [{type: 'sets', value: null}]
    //   // })
    //   // const newState = update(prevState, {
    //   //   exerciseData: { [exerciseIdx]: { } }
    //   // })
    //   // instead of an array, attempt to do this with an object and update
    //   // probably
    //   return {
    //     exerciseData: newExerciseData
    //   }
    // })
  }

  renderAttributes(exIdx) {
    if (this.state.exerciseData[exIdx]) {
      const pickers = this.state.exerciseData[exIdx].map((attr, attrIdx) => {
        return (
          <Picker
            selectedValue={this.state.exerciseData[exIdx].type}
            onValueChange={ this.setAttrType.bind(this, exIdx, attrIdx)}
            key={attrIdx}
          >
            <Picker.Item label='sets' value='sets'/>
            <Picker.Item label='reps' value='reps'/>
            <Picker.Item label='weight' value='weight'/>
          </Picker>
        )
      })

      return (<View>{ pickers }</View>)
    } else {
      return null
    }
  }

  renderExerciseInputs() {
    const inputs = this.state.inputValues.map((val, idx) => {
      return (
        <View key={idx}>
          <TextInput
            placeholder='exercise name'
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

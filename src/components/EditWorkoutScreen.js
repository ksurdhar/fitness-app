import React from 'react'
import { connect } from 'react-redux'
import produce from 'immer'
import {
  StyleSheet,
  ScrollView,
  TextInput,
  Keyboard,
  View,
  Picker,
} from 'react-native'
import * as workoutActions from '../redux/actions/workoutActions'
import * as sessionActions from '../redux/actions/sessionActions'
import { Dropdown } from 'react-native-material-dropdown'
import { Button, Text } from 'native-base'

INITIAL_STATE = {
  workoutName: '',
  exerciseNames: [],
  exerciseData: {},
  isRecording: null,
}

ATTRIBUTE_TYPES = [
  {value: 'sets'},
  {value: 'reps'},
  {value: 'weight'},
  {value: 'seconds'},
]

ATTRIBUTE_VALS = [...Array(100).keys()].map((num) => {
  return {value: num + 1}
})

class EditWorkoutScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    const { params } = navigation.state
    const recordStr = `Recording ${params.workoutName}`
    const createStr = `Defining ${params.workoutName}`

    return {
      title: params.isRecording ? recordStr : createStr,
      tabBarLabel: 'Record',
      tabBarIcon: ({ tintColor }) => (
        <Text>Record</Text>
      )
    }
  }

  constructor() {
    super()
    this.state = INITIAL_STATE
  }

  resetState() {
    this.setState(INITIAL_STATE)
  }

  componentDidMount() {
    const params = this.props.navigation.state.params
    this.setState({
      workoutID: params.workoutID,
      workoutName: params.workoutName,
      isRecording: params.isRecording,
      exerciseData: params.exerciseData,
      exerciseNames: params.exerciseNames,
    })
  }

  componentDidUpdate() {
    // console.log('state',this.state)
  }

  addWorkout() {
    this.props.addWorkout(
      this.state.workoutName,
      this.state.exerciseNames,
      this.state.exerciseData,
      this.props.user.uid
    )
    this.resetState()
    this.props.navigation.navigate('Workouts')
    Keyboard.dismiss()
  }

  addSession() {
    this.props.addSession(
      this.state.exerciseNames,
      this.state.exerciseData,
      this.props.user.uid,
      this.state.workoutID,
      this.state.workoutName
    )
    this.resetState()
    this.props.navigation.navigate('Workouts')
    Keyboard.dismiss()
  }

  addWorkoutOrSession() {
    if (this.state.isRecording) {
      this.addSession()
    } else {
      this.addWorkout()
    }
  }

  addInput() {
    let newEIdx = 0 // default when no exercises exist
    if (Object.keys(this.state.exerciseData).length > 0) {
      newEIdx = Object.keys(this.state.exerciseData).length
    }
    this.setState((prevState) => {
      return produce(prevState, (draftState) => {
        draftState.exerciseNames.push('')
        draftState.exerciseData[newEIdx] = {0: {type: null, val: null}}
      })
    })
  }

  handleInputChange(idx, value) {
    let exerciseNames = [...this.state.exerciseNames]
    exerciseNames[idx] = value
    this.setState({ exerciseNames })
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

  renderValDropdown(exIdx, attrIdx) {
    if (this.state.isRecording) {
      return (
        <View style={{ width: 96, marginLeft: 8}}>
          <Dropdown
            label='Val'
            data={ATTRIBUTE_VALS}
            onChangeText={ this.setAttrVal.bind(this, exIdx, attrIdx) }
          />
        </View>
      )
    } return null
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
                value={attrEntry[1].type ? attrEntry[1].type : ''}
                label='Attribute'
                data={ATTRIBUTE_TYPES}
                disabled={this.state.isRecording}
                onChangeText={ this.setAttrType.bind(this, exIdx, attrIdx) }
              />
            </View>
            { this.renderValDropdown(exIdx, attrIdx) }
          </View>
        )
      })

      return (<View>{ dropdowns }</View>)
    } else {
      return null
    }
  }

  renderExerciseInputs() {
    const inputs = this.state.exerciseNames.map((val, idx) => {
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
          { !this.state.isRecording && <Button title='Add Attribute' onPress={() => this.addAttribute(idx) }/> }
        </View>
      )
    })

    return (<View>{ inputs }</View>)
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{flex: 1}} contentContainerStyle={styles.container}>
          { this.renderExerciseInputs() }
          { !this.state.isRecording && <Button title='Add Exercise' onPress={() => this.addInput() }/> }
          <Button
            rounded
            small
            bordered
            onPress={() => {this.addWorkoutOrSession()}}
            title={ this.state.isRecording ? 'Record' : 'Create' }
          >
            <Text>{ this.state.isRecording ? 'Record' : 'Create' }</Text>
          </Button>
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addWorkout: (workoutName, exerciseNames, exerciseData, uid) => { dispatch(workoutActions.addWorkout(workoutName, exerciseNames, exerciseData, uid)) },
    addSession: (exerciseNames, exerciseData, uid, workoutID, workoutName) => { dispatch(sessionActions.addSession(exerciseNames, exerciseData, uid, workoutID, workoutName)) },
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

export default connect(mapStateToProps, mapDispatchToProps)(EditWorkoutScreen)

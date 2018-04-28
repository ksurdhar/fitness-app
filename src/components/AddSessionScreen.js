import React from 'react'
import { connect } from 'react-redux'
import produce from 'immer'
import {
  StyleSheet,
  Keyboard,
} from 'react-native'
import * as sessionActions from '../redux/actions/sessionActions'
import { Dropdown } from 'react-native-material-dropdown'
import { Button, Text, Container, Content, Input, Form, Item, Label, Card, CardItem, Body } from 'native-base'

// SHAPE OF EXERCISE DATA
// Object {
//   "0": Object {
//     "0": Object {
//       "type": "sets",
//       "val": null,
//     },
//     "1": Object {
//       "type": "reps",
//       "val": null,
//     },
//   },
// }

INITIAL_STATE = {
  workoutName: '',
  exerciseNames: [],
  exerciseData: {},
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user
  }
}

class AddSessionScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    const { params } = navigation.state

    return {
      title: `Recording ${params.workoutName}`,
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
      exerciseData: params.exerciseData,
      exerciseNames: params.exerciseNames,
    })
  }

  componentDidUpdate() {
    console.log('state',this.state)
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

  setAttrVal(exIdx, attrIdx, val) {
    this.setState((prevState) => {
      return produce(prevState, (draftState) => {
        draftState.exerciseData[exIdx][attrIdx].val = val
      })
    })
  }

  renderAttrInputs(exIdx) {
    return Object.entries(this.state.exerciseData[exIdx]).map(([attrIdx, attr]) => {
      return (
        <CardItem key={attrIdx} style={{backgroundColor: 'white', height: 60, marginBottom: 10}}>
          <Body>
            <Item stackedLabel>
              <Label>{attr.type}</Label>
              <Input
                style={{width: 320, maxHeight: 25, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: 'gray'}}
                underline
                keyboardType={"numeric"}
                onChangeText={ this.setAttrVal.bind(this, exIdx, attrIdx)}
              />
            </Item>
          </Body>
        </CardItem>
      )
    })
  }

  renderExercises() {
    return this.state.exerciseNames.map((val, exIdx) => {
      return (
        <Card key={exIdx}>
          <CardItem header bordered>
            <Text>{val}</Text>
          </CardItem>
          { this.renderAttrInputs(exIdx) }
        </Card>
      )
    })
  }

  render() {
    const recordButton = (
      <Button rounded success onPress={() => this.addSession() }>
        <Text>Record Session</Text>
      </Button>
    )
    return (
      <Content padder>
        { this.renderExercises() }
        <Container style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, height: 80}}>
          { recordButton }
        </Container>
      </Content>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addSession: (exerciseNames, exerciseData, uid, workoutID, workoutName) => { dispatch(sessionActions.addSession(exerciseNames, exerciseData, uid, workoutID, workoutName)) },
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(AddSessionScreen)

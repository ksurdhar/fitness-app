import React from 'react'
import produce from 'immer'
import {
  ScrollView,
  Dimensions,
  Animated,
  Button,
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableWithoutFeedback
} from 'react-native'
import { format } from 'date-fns'

import ExpandingCard from './reusable/expandingCard'
import KButton from './reusable/button'
import Input from './reusable/input'
import Switch from './reusable/switch'
import PressCapture from './reusable/pressCapture'
import { common, COLORS } from './reusable/common'

// ['Leg Blasters', 'Ab Crunches', 'Arm Destroyer', 'Leg Blasters', 'Ab Crunches', 'Arm Destroyer']
DEMO_STATE = {
  mockWorkouts: ['Leg Blasters', 'Ab Crunches', 'Arm Destroyer', 'Leg Blasters', 'Ab Crunches', 'Arm Destroyer']
}

// SHAPE OF EXERCISE DATA
// Object {
  // "0": Object {
  //   "0": Object {
  //     "type": "sets",
  //     "val": null,
  //   },
  //   "1": Object {
  //     "type": "reps",
  //     "val": null,
  //   },
  // },
// }

INITIAL_STATE = {
  workoutName: '',
  exerciseNames: ['pullups', 'pushups'],
  exerciseData: {
    0: {
      0: {
        "type": "sets",
        "val": null,
      },
      1: {
        "type": "reps",
        "val": null,
      },
    },
    1: {
      0: {
        "type": "sets",
        "val": null,
      },
    },
  },
}

class DemoScreen extends React.Component {
  constructor() {
    super()
    this.state = INITIAL_STATE
  }

  setAttrVal(exIdx, attrIdx, val) {
    this.setState((prevState) => {
      return produce(prevState, (draftState) => {
        draftState.exerciseData[exIdx][attrIdx].val = val
      })
    })
  }

  renderAttrInputs(exIdx) {
    console.log(this.state.exerciseData, exIdx)
    return Object.entries(this.state.exerciseData[exIdx]).map(([attrIdx, attr]) => {
      return (
        <View key={attrIdx}>
          <Text>{attr.type}</Text>
        </View>
        // <CardItem key={attrIdx} style={{backgroundColor: 'white', height: 60, marginBottom: 10}}>
        //   <Body>
        //     <Item stackedLabel>
        //       <Label>{attr.type}</Label>
        //       <Input
        //         style={{width: 320, maxHeight: 25, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: 'gray'}}
        //         underline
        //         keyboardType={"numeric"}
        //         onChangeText={ this.setAttrVal.bind(this, exIdx, attrIdx)}
        //       />
        //     </Item>
        //   </Body>
        // </CardItem>
      )
    })
  }

  renderExercises() {
    if (this.state.exerciseNames) {
      return this.state.exerciseNames.map((val, exIdx) => {
        return (
          // <Card key={exIdx}>
          //   <CardItem header bordered>
          //
          //   </CardItem>
          //
          // </Card>
          <View>
            <Text>{val}</Text>
            { this.renderAttrInputs(exIdx) }
          </View>
        )
      })
    } else {
      return null
    }
  }

  render() {
    const { width, height } = Dimensions.get('window')

    // no height!!
    // const recordButton = (
    //   <Button rounded success onPress={() => this.addSession() }>
    //     <Text>Record Session</Text>
    //   </Button>
    // )
    // return (
    //   <Content padder>
    //     { this.renderExercises() }
    //     <Container style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, height: 80}}>
    //       { recordButton }
    //     </Container>
    //   </Content>
    // )
    return (
      <View style={[common.staticView, { paddingLeft: 10, paddingRight: 10, backgroundColor: COLORS.white, height: height }]}>
        <ScrollView style={{paddingTop: 10, marginBottom: 110}}>
          { this.renderExercises() }
        </ScrollView>
      </View>
    )

  }
}

export default DemoScreen

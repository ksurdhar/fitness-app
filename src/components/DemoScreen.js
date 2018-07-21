import React from 'react'
import produce from 'immer'
import {
  ScrollView,
  Dimensions,
  Animated,
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Button,
  TouchableWithoutFeedback
} from 'react-native'
import { format } from 'date-fns'

import ExpandingCard from './reusable/expandingCard'
import KButton from './reusable/button'
import Input from './reusable/input'
import Switch from './reusable/switch'
import PressCapture from './reusable/pressCapture'
import { common, COLORS } from './reusable/common'

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
        "type": "bleps",
        "val": null,
      },
      1: {
        "type": "reps",
        "val": null,
      },
      2: {
        "type": "bleps",
        "val": null,
      },
      3: {
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
// make keyboard type numeric
  renderAttrInputs(exIdx) {
    return Object.entries(this.state.exerciseData[exIdx]).map(([attrIdx, attr]) => {
      return (
        <View key={attrIdx}>
          <Input
            value={null}
            labelText={attr.type}
            onChangeText={this.setAttrVal.bind(this, exIdx, attrIdx)}
            ref={(element) => { this.input1 = element }}
            small={true}
            fixedLabel={true}
            lineColors={[COLORS.gray1, COLORS.chill]}
          />
        </View>
      )
    })
  }

  renderExercises() {
    if (this.state.exerciseNames) {
      return this.state.exerciseNames.map((val, exIdx) => {
        return (
            <ExpandingCard
              key={exIdx}
              header={val}
              deleteHandler={() => {}}
              expandable={false}
              cardHeights={[600, 600]}
            >
              { this.renderAttrInputs(exIdx) }
            </ExpandingCard>
        )
      })
    } else {
      return null
    }
  }

  render() {
    const { width, height } = Dimensions.get('window')

    return (
      <View style={[common.staticView, { paddingLeft: 10, paddingRight: 10, backgroundColor: COLORS.white, height: height }]}>
        <ScrollView style={{paddingTop: 10}}>
          { this.renderExercises() }
          <View style={[common.row]}>
            <TouchableOpacity onPress={() => this.addSession() }>
              <View style={{padding: 14, backgroundColor: COLORS.peach}}>
                <Text style={{fontSize: 24, fontFamily: 'rubik-medium', textAlign: 'center', color: COLORS.white}}>
                  Record Session
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    )

  }
}

export default DemoScreen

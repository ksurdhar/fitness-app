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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

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

  componentDidUpdate() {
    // console.log(this.state)
  }

  handleCapture = () => {
    this.state.exerciseNames.forEach((name, exIdx) => {
      Object.entries(this.state.exerciseData[exIdx]).forEach(([attrIdx, attr]) => {
        this[`${exIdx}-${attrIdx}-input`] && this[`${exIdx}-${attrIdx}-input`].blur()
      })
    })
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
      const attrVal = this.state.exerciseData[exIdx][attrIdx].val
      return (
        <View key={attrIdx}>
          <Input
            value={attrVal}
            labelText={attr.type}
            onChangeText={this.setAttrVal.bind(this, exIdx, attrIdx)}
            ref={(element) => { this[`${exIdx}-${attrIdx}-input`] = element }}
            small={true}
            lineColors={[COLORS.gray1, COLORS.chill]}
            isValid={attrVal && attrVal.length > 0}
            fixedLabel={true}
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
      <PressCapture onPress={this.handleCapture}>
        <View style={[common.staticView, { paddingLeft: 10, paddingRight: 10, backgroundColor: COLORS.white, height: height }]}>
          <KeyboardAwareScrollView style={{paddingTop: 10}}>
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
          </KeyboardAwareScrollView>
        </View>
      </PressCapture>
    )

  }
}

export default DemoScreen

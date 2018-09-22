import React from 'react'
import {
  Dimensions,
  StyleSheet,
  View,
} from 'react-native'

import { common, DYNAMIC } from './common'

class BasicCard extends React.Component {
  render() {
    const { width } = Dimensions.get('window')

    return (
      <View style={styleCard(width)}>
        <View style={{borderBottomColor: DYNAMIC.text1, borderBottomWidth: 1}}>
          <View style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 16, justifyContent: 'space-between', flexDirection: 'row'}}>
            { this.props.header }
          </View>
        </View>
        <View style={{paddingTop: 10, paddingLeft: 16, paddingRight: 16}}>
          { this.props.body }
        </View>
      </View>
    )
  }
}

function styleCard(width) {
  return {
    width: width - 30,
    backgroundColor: DYNAMIC.foreground10,
    marginBottom: 16,
    marginLeft: 6,
    shadowColor: DYNAMIC.text10,
    shadowOpacity: 0.3,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 2,
    paddingBottom: 8,
  }
}

export default BasicCard

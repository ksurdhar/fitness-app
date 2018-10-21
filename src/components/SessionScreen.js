import React from 'react'
import { connect } from 'react-redux'
import { StyleSheet, Text, View, Button, FlatList } from 'react-native'
import { Feather } from '@expo/vector-icons'

import * as sessionActions from '../redux/actions/sessionActions'

class SessionScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    const { params } = navigation.state

    return {
      title: `${params.session.workoutName} Session`,
    }
  }

  _keyExtractor(item, index) {
    return item.id
  }

  removeSession(id) {
    const userID = this.props.navigation.state.params.userID
    this.props.removeSession(id, userID)
    this.props.navigation.goBack()
  }

  renderAttributes(attributes) {
    return Object.keys(attributes).map((attrKey, idx) => {
      const attr = attributes[idx]
      return (<Text key={idx}>{`${attr.type}: ${attr.val}`}</Text>)
    })
  }

  renderExercise({item}) {
    return (
      <View style={styles.row}>
        <View style={{flexDirection: 'column', flex: 1}}>
          <Text style={styles.rowText}>{item.name}</Text>
          { this.renderAttributes(item.attributes) }
        </View>
      </View>
    )
  }

  renderExercises() {
    const exercises = Object.values(this.props.navigation.state.params.session.exercises)
    return (
      <FlatList
        style={styles.list}
        data={exercises}
        keyExtractor={this._keyExtractor}
        renderItem={this.renderExercise.bind(this)}
      />
    )
  }

  render() {
    const session = this.props.navigation.state.params.session
    return (
      <View style={styles.container}>
        {this.renderExercises()}
        <Button
          onPress={() => { this.removeSession(session.id) }}
          title="Remove"
        />
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    removeSession: (id, userID) => { dispatch(sessionActions.removeSession(id, userID)); },
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  list: {
    flex: 1,
    flexDirection: 'column',
  },
  row: {
    backgroundColor: 'skyblue',
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row'
  },
  rowText: {
    fontSize: 18,
    paddingLeft: 20,
    paddingTop: 7,
  },
  emptyMessage: {
    alignItems: 'center',
    marginTop: 150
  }
});

export default connect(null, mapDispatchToProps)(SessionScreen);

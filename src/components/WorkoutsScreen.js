import React from 'react'
import { connect } from 'react-redux'
import { StyleSheet, Text, View, Button, FlatList } from 'react-native'
import * as workoutActions from '../redux/actions/workoutActions'
import {format} from 'date-fns'

const mapStateToProps = (state, ownProps) => {
  return {
    workouts: state.workouts.workouts,
    sessions: state.sessions.sessions,
    userID: state.auth.user.uid,
  }
}

class WorkoutsScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Workouts',
    tabBarIcon: ({ tintColor }) => (
      <Text>Workouts</Text>
    ),
  }

  _keyExtractor(item, index) {
    return item.id
  }

  componentDidUpdate() {
    // console.log('WORKOUTS STATE', this.state)
    // console.log('WORKOUTS PROPS', this.props)
  }

  navigateToWorkout(item) {
    this.props.navigation.navigate('Workout', {
      workout: item,
      userID: this.props.userID
    })
  }

  renderRow({item}) {
    const dateString = format(item.date, 'MMM D, YYYY [at] h:mm A')
    return (
      <View style={styles.row}>
        <Text style={styles.rowText}>{`${item.workoutName} on ${dateString}`}</Text>
        <Button
          onPress={() => { this.navigateToWorkout(item) }}
          title="Details"
        />
      </View>
    )
  }

  renderWorkouts() {
    if (this.props.sessions.length > 0) {
      return (
        <FlatList
          style={styles.list}
          data={this.props.sessions}
          keyExtractor={this._keyExtractor}
          renderItem={this.renderRow.bind(this)}
        />
      )
    } else {
      return (
        <View style={styles.emptyMessage}>
          <Text>No Workouts Defined Yet!</Text>
        </View>
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Workouts</Text>
        </View>
        {this.renderWorkouts()}
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    removeWorkout: (id, userID) => { dispatch(workoutActions.removeWorkout(id, userID)) },
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  titleContainer: {
    alignItems: 'center'
  },
  title: {
    fontSize: 40,
    marginTop: 60,
    marginBottom: 20,
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
})

export default connect(mapStateToProps, mapDispatchToProps)(WorkoutsScreen)

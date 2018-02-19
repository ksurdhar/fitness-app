import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';
import * as workoutActions from '../redux/actions/workoutActions';

class WorkoutScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Workouts',
    tabBarIcon: ({ tintColor }) => (
      <Text>Workouts</Text>
    ),
  }

  _keyExtractor(item, index) {
    return item.id
  }

  removeWorkout(id) {
    const userID = this.props.navigation.state.params.userID
    this.props.removeWorkout(id, userID)
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
    const exercises = Object.values(this.props.navigation.state.params.workout.exercises)
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
    const workout = this.props.navigation.state.params.workout
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{workout.name}</Text>
        </View>
        {this.renderExercises()}
        <Button
          onPress={() => { this.removeWorkout(workout.id) }}
          title="Remove"
        />
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    removeWorkout: (id, userID) => { dispatch(workoutActions.removeWorkout(id, userID)); },
  };
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
});

export default connect(null, mapDispatchToProps)(WorkoutScreen);

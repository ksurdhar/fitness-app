import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';
import * as workoutActions from '../redux/actions/workoutActions';

class WorkoutsScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Workouts',
    tabBarIcon: ({ tintColor }) => (
      <Text>Workouts</Text>
    ),
  };

  _keyExtractor(item, index) {
    return item.id
  }

  removeWorkout(id) {
    this.props.removeWorkout(id, this.props.userID)
  }

  renderRow({item}) {
    return (
      <View style={styles.row}>
        <Text style={styles.rowText}>{item.name}</Text>
        <Button
          onPress={() => this.removeWorkout(item.id) }
          title="x"
        />
      </View>
    )
  }

  renderList() {
    if (this.props.workouts.length > 0) {
      return (
        <FlatList
          style={styles.list}
          data={this.props.workouts}
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
        {this.renderList()}
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    workouts: state.workouts.workouts,
    userID: state.auth.user.uid,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    removeWorkout: (name, userID) => { dispatch(workoutActions.removeWorkout(name, userID)); },
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

export default connect(mapStateToProps, mapDispatchToProps)(WorkoutsScreen);

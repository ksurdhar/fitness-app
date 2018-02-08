import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';
import * as workoutActions from '../redux/actions/workoutActions';

class HomeScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Home',
    tabBarIcon: ({ tintColor }) => (
      <Text>Home</Text>
    ),
  };

  _keyExtractor(item, index) {
    return item.id
  }

  removeWorkout(id) {
    this.props.removeWorkout(id)
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
      console.log(' no workouts defined')
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
        {this.renderList()}
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    workouts: state.workouts.workouts
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    removeWorkout: (name) => { dispatch(workoutActions.removeWorkout(name)); },
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
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
    marginTop: 300
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

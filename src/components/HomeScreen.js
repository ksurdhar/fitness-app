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
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderList()}
        <Button
          onPress={() => this.props.navigation.navigate('Workouts')}
          title="Go to workouts"
        />
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
  },
  list: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 20,
  },
  row: {
    backgroundColor: 'skyblue',
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    paddingLeft: 20,
    paddingTop: 7,
  },
  rowText: {
    fontSize: 18,
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Button, ListView } from 'react-native';


class HomeScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Home',
    tabBarIcon: ({ tintColor }) => (
      <Text>Home</Text>
    ),
  };

  componentWillMount() {
    this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
  }

  renderRow(workout) {
    return (
      <Text>{workout.name}</Text>
    )
  }

  renderList() {
    if (!!this.props.workouts) {
      return (
        <ListView
          dataSource={this.dataSource.cloneWithRows(Object.values(this.props.workouts))}
          renderRow={this.renderRow.bind(this)}
        />
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          onPress={() => this.props.navigation.navigate('Workouts')}
          title="Go to workouts"
        />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default connect(mapStateToProps, null)(HomeScreen);

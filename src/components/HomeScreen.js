import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';

class HomeScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Home',
    tabBarIcon: ({ tintColor }) => (
      <Text>Home</Text>
    ),
  };

  renderRow({item}) {
    return (
      <Text>{item.name}</Text>
    )
  }

  renderList() {
    if (Object.values(this.props.workouts).length > 0) {
      return (
        <FlatList
          data={Object.values(this.props.workouts)}
          renderItem={this.renderRow.bind(this)}
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

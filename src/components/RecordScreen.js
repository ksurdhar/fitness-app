import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import * as workoutActions from '../redux/actions/workoutActions';

class RecordScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Record',
    tabBarIcon: ({ tintColor }) => (
      <Text>Record</Text>
    )
  };

  constructor() {
    super()

    this.state = {
      workoutName: ''
    }
  }

  addWorkout() {
    this.props.addWorkout(this.state.workoutName);
    this.setState({workoutName: ''});
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="ex. squats"
          style={styles.nameInput}
          ref="newWorkout"
          value={this.state.workoutName}
          onChangeText={(workoutName) => this.setState({workoutName})}
          onSubmitEditing={() => this.addWorkout()} />
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addWorkout: (name) => { dispatch(workoutActions.addWorkout(name)); },
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  nameInput: {
    backgroundColor: '#FFFFFF',
    height: 42,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 10,
    borderRadius: 5,
    fontSize: 20
  },
});

export default connect(null, mapDispatchToProps)(RecordScreen);

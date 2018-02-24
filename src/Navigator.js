import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { TabNavigator, StackNavigator } from "react-navigation";

import RecordScreen from "./components/RecordScreen";
import WorkoutsScreen from "./components/WorkoutsScreen";
import WorkoutScreen from "./components/WorkoutScreen";
import ProfileScreen from "./components/ProfileScreen";
import AddWorkoutScreen from './components/AddWorkoutScreen';
import EditWorkoutScreen from './components/EditWorkoutScreen';

const WorkoutStack = StackNavigator({
  Workouts: {
    screen: WorkoutsScreen
  },
  Workout: {
    screen: WorkoutScreen
  }
})

const RecordStack = StackNavigator({
  Record: {
    screen: RecordScreen
  },
  AddWorkout: {
    screen: AddWorkoutScreen
  },
  EditWorkout: {
    screen: EditWorkoutScreen
  }
})

const Navigator = TabNavigator(
  {
    Workouts: {
      screen: WorkoutStack
    },
    Record: {
      screen: RecordStack
    },
    Profile: {
      screen: ProfileScreen
    }
  },
  {
    tabBarPosition: "bottom",
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: "#e91e63"
    }
  }
);

export default Navigator;

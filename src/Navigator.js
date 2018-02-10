import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { TabNavigator } from "react-navigation";

import RecordScreen from "./components/RecordScreen";
import WorkoutsScreen from "./components/WorkoutsScreen";
import ProfileScreen from "./components/ProfileScreen";

const Navigator = TabNavigator(
  {
    Workouts: {
      screen: WorkoutsScreen
    },
    Record: {
      screen: RecordScreen
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

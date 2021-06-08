import React from 'react';
import { View, Image } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Issuescreen from './Screens/Issuescreen';
import Searchscreen from './Screens/Searchscreen';
import Welcome from './Screens/Welcomescreen';

export default class App extends React.Component {
  render() {
    return (
      <AppContainer />
    );
  }
}

const TabNavigator = createBottomTabNavigator({
  Issue: {
    screen: Issuescreen,
    navigationOptions: {
      tabBarIcon: <Image style={{ width: 40, height: 40, }}
        source={require("./assets/book.png")} />,
      tabBarLabel: "BOOK TRANSACTIONS"
    }
  },
  Search: {
    screen: Searchscreen,
    navigationOptions: {
      tabBarIcon: <Image style={{ width: 40, height: 40, }}
        source={require("./assets/searchingbook.png")} />,
      tabBarLabel: "SEARCH"
    }
  },
})

const SwitchNavigator = createSwitchNavigator({
  Welcome: Welcome,
  TabNavigator: TabNavigator
})

const AppContainer = createAppContainer(
  SwitchNavigator
)
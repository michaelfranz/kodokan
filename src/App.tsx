import Amplify, { Analytics } from 'aws-amplify'
import awsconfig from './aws-exports'
import React, { useEffect } from 'react'
import { Image, StyleSheet } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import { PRIMARY_COLOUR, BACKGROUND_COLOUR } from './theme/colours'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import DictionaryScreen from './dictionary/index'
import WazaScreen from './waza/index'
import GokyoScreen from './gokyo/index'
import GiScreen from './gi/index'
import AboutScreen from './about/index'
import WazaDetailScreen from './waza/DetailScreen'
import { FONT_FAMILY_SUBHEADING } from './theme/type'

Amplify.configure(awsconfig)

const styles = StyleSheet.create({
  icon: {
    height: 25,
    width: 38,
  },
})

const WazaNavigationScreens = {
  WazaClassificationScreen: {
    screen: WazaScreen,
    navigationOptions: () => ({
      header: null,
    }),
  },
  WazaClassificationDetailScreen: {
    navigationOptions: ({ navigation }) => ({
      title: `${navigation.state.params.classification}`,
      headerVisible: true,
      headerStyle: {
        backgroundColor: BACKGROUND_COLOUR,
      },
    }),
    path: 'wazaClassificationDetail/:waza',
    screen: WazaDetailScreen,
  },
}

const WazaNavigator = createStackNavigator({
  ...WazaNavigationScreens,
})

const DictionaryNavigator = createStackNavigator({
  DictionaryScreen: {
    screen: DictionaryScreen,
    navigationOptions: () => ({
      header: null,
    }),
  },
  ...WazaNavigationScreens,
})

const MainNavigator = createBottomTabNavigator(
  {
    Dictionary: {
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Image
            source={require('./images/tabbar-dictionary.png')}
            style={[styles.icon, { tintColor }]}
          />
        ),
        tabBarLabel: 'Dictionary',
      },
      screen: DictionaryNavigator,
    },
    Gokyo: {
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Image
            source={require('./images/tabbar-gokyo.png')}
            style={[styles.icon, { tintColor }]}
          />
        ),
        tabBarLabel: 'Gokyo',
      },
      screen: GokyoScreen,
    },
    Waza: {
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Image
            source={require('./images/tabbar-waza.png')}
            style={[styles.icon, { tintColor }]}
          />
        ),
        tabBarLabel: 'Waza',
      },
      screen: WazaNavigator,
    },
    Gi: {
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Image
            source={require('./images/tabbar-gi.png')}
            style={[styles.icon, { tintColor }]}
          />
        ),
        tabBarLabel: 'Gi',
      },
      screen: GiScreen,
    },
    About: {
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Image
            source={require('./images/tabbar-about.png')}
            style={[styles.icon, { tintColor }]}
          />
        ),
        tabBarLabel: 'About',
      },
      screen: AboutScreen,
    },
  },
  {
    tabBarOptions: {
      activeTintColor: PRIMARY_COLOUR,
      labelStyle: {
        fontFamily: FONT_FAMILY_SUBHEADING,
      },
    },
  }
)

const AppNavigator = createStackNavigator(
  {
    MainNavigator: {
      screen: MainNavigator,
    },
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  }
)

const AppContainer = createAppContainer(AppNavigator)

const App = (): React.ReactElement<{}> => {
  useEffect(() => {
    SplashScreen.hide()
  }, [])

  return <AppContainer />
}

export default App

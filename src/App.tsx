import React from 'react'
import { Image, StyleSheet, LogBox } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { PRIMARY_COLOUR, BACKGROUND_COLOUR } from './theme/colours'
import DictionaryScreen from './dictionary/index'
import WazaScreen from './waza/index'
import GokyoScreen from './gokyo/index'
import GiScreen from './gi/index'
import AboutScreen from './about/index'
import WazaDetailScreen from './waza/DetailScreen'
import { FONT_FAMILY_SUBHEADING } from './theme/type'
import VideoScreen from './video/VideoScreen'

LogBox.ignoreLogs([
  'Require cycle: node_modules/',
])

const styles = StyleSheet.create({
  icon: {
    height: 25,
    width: 38,
  },
})

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()
const DictionaryStack = createStackNavigator()
const WazaStack = createStackNavigator()

const DictionaryNavigator = () => (
  <DictionaryStack.Navigator screenOptions={{ headerShown: false }}>
    <DictionaryStack.Screen name="DictionaryScreen" component={DictionaryScreen} />
  </DictionaryStack.Navigator>
)

const WazaNavigator = () => (
  <WazaStack.Navigator>
    <WazaStack.Screen
      name="WazaClassificationScreen"
      component={WazaScreen}
      options={{ headerShown: false }}
    />
    <WazaStack.Screen
      name="WazaClassificationDetailScreen"
      component={WazaDetailScreen}
      options={({ route }) => ({
        title: (route.params as any)?.classification ?? '',
        headerStyle: { backgroundColor: BACKGROUND_COLOUR },
        headerBackTitle: 'Back',
      })}
    />
  </WazaStack.Navigator>
)

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: PRIMARY_COLOUR,
      tabBarLabelStyle: { fontFamily: FONT_FAMILY_SUBHEADING },
    }}
  >
    <Tab.Screen
      name="Dictionary"
      component={DictionaryNavigator}
      options={{
        tabBarIcon: ({ color }) => (
          <Image
            source={require('./images/tabbar-dictionary.png')}
            style={[styles.icon, { tintColor: color }]}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Gokyo"
      component={GokyoScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <Image
            source={require('./images/tabbar-gokyo.png')}
            style={[styles.icon, { tintColor: color }]}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Waza"
      component={WazaNavigator}
      options={{
        tabBarIcon: ({ color }) => (
          <Image
            source={require('./images/tabbar-waza.png')}
            style={[styles.icon, { tintColor: color }]}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Gi"
      component={GiScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <Image
            source={require('./images/tabbar-gi.png')}
            style={[styles.icon, { tintColor: color }]}
          />
        ),
      }}
    />
    <Tab.Screen
      name="About"
      component={AboutScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <Image
            source={require('./images/tabbar-about.png')}
            style={[styles.icon, { tintColor: color }]}
          />
        ),
      }}
    />
  </Tab.Navigator>
)

const App = (): React.ReactElement => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen
            name="VideoScreen"
            component={VideoScreen}
            options={{ presentation: 'modal' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

export default App

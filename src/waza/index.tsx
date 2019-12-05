import React from 'react'
import { View, Text } from 'react-native'
import withScreenLayout from '../common/withScreenLayout'

const WazaScreen = (): React.ReactElement<{}> => {
  return (
    <View>
      <Text>Waza</Text>
    </View>
  )
}

export default withScreenLayout(WazaScreen)

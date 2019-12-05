import React from 'react'
import { View, Text } from 'react-native'
import withScreenLayout from '../common/withScreenLayout'

const GokyoScreen = (): React.ReactElement<{}> => {
  return (
    <View>
      <Text>Gokyo</Text>
    </View>
  )
}

export default withScreenLayout(GokyoScreen)

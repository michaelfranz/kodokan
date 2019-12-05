import React from 'react'
import { View, Text } from 'react-native'
import withScreenLayout from '../common/withScreenLayout'

const GiScreen = (): React.ReactElement<{}> => {
  return (
    <View>
      <Text>Gi</Text>
    </View>
  )
}

export default withScreenLayout(GiScreen)

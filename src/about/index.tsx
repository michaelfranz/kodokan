import React from 'react'
import { View, Text } from 'react-native'
import withScreenLayout from '../common/withScreenLayout'

const AboutScreen = (): React.ReactElement<{}> => {
  return (
    <View>
      <Text>About</Text>
    </View>
  )
}

export default withScreenLayout(AboutScreen)

import React from 'react'
import { View, Text } from 'react-native'
import withScreenLayout from '../common/withScreenLayout'

const DictionaryScreen = (): React.ReactElement<{}> => {
  return (
    <View>
      <Text>Dictionary</Text>
    </View>
  )
}

export default withScreenLayout(DictionaryScreen)

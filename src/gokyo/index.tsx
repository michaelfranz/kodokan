import React from 'react'
import { View } from 'react-native'
import withScreenLayout from '../common/withScreenLayout'
import { H1 } from '../common/text'

const GokyoScreen = (): React.ReactElement<{}> => {
  return (
    <View>
      <H1>Gokyo</H1>
    </View>
  )
}

export default withScreenLayout(GokyoScreen)

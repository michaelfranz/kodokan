import React from 'react'
import { View } from 'react-native'
import withScreenLayout from '../common/withScreenLayout'
import { H1 } from '../common/text'

const GiScreen = (): React.ReactElement<{}> => {
  return (
    <View>
      <H1>Gi</H1>
    </View>
  )
}

export default withScreenLayout(GiScreen)

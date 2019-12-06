import React from 'react'
import { View } from 'react-native'
import withScreenLayout from '../common/withScreenLayout'
import { H1 } from '../common/text'

const WazaScreen = (): React.ReactElement<{}> => {
  return (
    <View>
      <H1>Waza</H1>
    </View>
  )
}

export default withScreenLayout(WazaScreen)

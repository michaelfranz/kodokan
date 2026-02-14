import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { BACKGROUND_COLOUR } from '../theme/colours'
import NetInfo, { NetInfoSubscription } from '@react-native-community/netinfo'

const dismissKeyboard = require('react-native-dismiss-keyboard')

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND_COLOUR,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export interface Props {
  orientation: 'landscape' | 'portrait'
  isOnline: boolean | null
  navigation: any
  route?: any
}

const withScreenLayout = <P extends {}>(
  WrappedComponent: React.ComponentType<P>,
  wrapInSafeArea?: boolean
): React.FunctionComponent<Props> => {
  const Layout = (props): React.ReactElement<Props & P> => {
    const [orientation, setOrientation] = useState<'landscape' | 'portrait'>(
      'portrait'
    )
    const [isOnline, setIsOnline] = useState<boolean | null>(null)

    const getOrientation = () => {
      if (Dimensions.get('window').width < Dimensions.get('window').height) {
        setOrientation('portrait')
      } else {
        setOrientation('landscape')
      }
    }

    useEffect(() => {
      const networkUnsubscribe: NetInfoSubscription = NetInfo.addEventListener(
        (networkState) => {
          setIsOnline(networkState.isInternetReachable)
        }
      )

      getOrientation()
      const subscription = Dimensions.addEventListener('change', () => {
        getOrientation()
      })

      return () => {
        subscription.remove()
        networkUnsubscribe()
      }
    }, [])

    dismissKeyboard()
    return (
      <View style={styles.container}>
        <WrappedComponent
          {...props}
          wrapInSafeArea={wrapInSafeArea}
          orientation={orientation}
          isOnline={isOnline}
        />
      </View>
    )
  }

  return Layout
}

export default withScreenLayout

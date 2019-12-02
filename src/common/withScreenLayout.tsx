import React from 'react'
import { View, StyleSheet } from 'react-native'
import { BACKGROUND_COLOUR } from '../theme/colours';

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND_COLOUR,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export interface Props {
}


const withScreenLayout = <P extends {}>(
  WrappedComponent: React.ComponentType<P>
): React.FunctionComponent<Props> => {

  const Layout = (props): React.ReactElement<Props & P> => {
    return (
      <View style={styles.container}>
        <WrappedComponent {...props} />
      </View>
    )
  }

  return Layout
}

export default withScreenLayout
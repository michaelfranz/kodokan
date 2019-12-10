import React, {useEffect, useState} from 'react'
import { View, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { BACKGROUND_COLOUR } from '../theme/colours';

const dismissKeyboard = require('react-native-dismiss-keyboard')

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND_COLOUR,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export interface Props {
  orientation: 'landscape' | 'portrait'
}


const withScreenLayout = <P extends {}>(
  WrappedComponent: React.ComponentType<P>,
  wrapInSafeArea?: boolean
): React.FunctionComponent<Props> => {

  const Layout = (props): React.ReactElement<Props & P> => {
    const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('portrait');

    const getOrientation = () => {
      if( Dimensions.get('window').width < Dimensions.get('window').height ) {
        setOrientation('portrait');
      }
      else {
        setOrientation('landscape');
      }
    }

    useEffect(()=> {
      getOrientation();
      Dimensions.addEventListener( 'change', () => {
        getOrientation();
      });

      return () => {
        Dimensions.removeEventListener( 'change', () => {
          getOrientation();
        });
      }
    }, [])


    dismissKeyboard();
    const WrapperComponent = wrapInSafeArea ? SafeAreaView : View;
    return (
      <WrapperComponent style={styles.container}>
        <WrappedComponent {...props} orientation={orientation} />
      </WrapperComponent>
    )
  }

  return Layout
}

export default withScreenLayout
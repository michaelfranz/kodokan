import React, { useState } from 'react'
import { View, StyleSheet, ImageBackground } from 'react-native'
import withScreenLayout, { Props } from '../common/withScreenLayout'
import {
  FOREGROUND_COLOUR_ALT,
  BACKGROUND_COLOUR,
  FOREGROUND_COLOUR,
} from '../theme/colours'
// import { SearchBar } from 'react-native-elements'
import { strings } from '../locales/i18n'

const BackgroundPortrait = require('../images/background1P.png')
const BackgroundLandscape = require('../images/background1L.png')

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
  },
  backgroundImageContainer: {
    flex: 2,
  },
  backgroundImage: {
    alignContent: 'center',
    opacity: 0.5,
    resizeMode: 'cover',
  },
  searchBar: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    borderTopWidth: 0,
    flex: 4,
    opacity: 0.6,
  },
  inputStyle: {
    backgroundColor: BACKGROUND_COLOUR,
    borderColor: 'rgb(199,200,204)',
    color: FOREGROUND_COLOUR,
  },
})

const DictionaryScreen = ({ orientation }): React.ReactElement<Props> => {
  const isLandscape = orientation === 'landscape'
  const [searchText, setSearchText] = useState('')

  return (
    <View style={styles.container}>
      <ImageBackground
        source={isLandscape ? BackgroundLandscape : BackgroundPortrait}
        style={styles.backgroundImageContainer}
        imageStyle={styles.backgroundImage}
      >
        <View style={{ flexDirection: 'row' }}>
          {/* <SearchBar
            autoCapitalize={'none'}
            autoCorrect={false}
            clearIcon={{ color: FOREGROUND_COLOUR_ALT, name: 'clear' }}
            containerStyle={styles.searchBar}
            inputStyle={styles.inputStyle}
            placeholder={strings('Search')}
            style={styles.searchBar}
          /> */}
        </View>
      </ImageBackground>
    </View>
  )
}

export default withScreenLayout(DictionaryScreen, true)

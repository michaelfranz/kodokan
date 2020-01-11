import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native'
import withScreenLayout, { Props } from '../common/withScreenLayout'
import {
  FOREGROUND_COLOUR_ALT,
  BACKGROUND_COLOUR,
  FOREGROUND_COLOUR,
} from '../theme/colours'
import { SearchBar } from 'react-native-elements'
import { strings } from '../locales/i18n'
import Icon from 'react-native-vector-icons/FontAwesome'
import { styles as fontStyles, Text } from '../common/text'

const BackgroundPortrait = require('../images/background1P.png')
const BackgroundLandscape = require('../images/background1L.png')
const dismissKeyboard = require('react-native-dismiss-keyboard')

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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
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
  searchIconContainer: {
    padding: 0,
  },
})

const DictionaryScreen = ({ orientation }): React.ReactElement<Props> => {
  const isLandscape = orientation === 'landscape'
  const [searchText, setSearchText] = useState('')
  const hasSearchText = !!searchText.trim().length
  const [bookmarkDisplayMode, setBookmarkDisplayMode] = useState(false)

  const onChangeText = (value: string) => {
    if (value.trim().length) {
      setBookmarkDisplayMode(false)
    }
    setSearchText(value)
  }

  const toggleBookmarkDisplay = () => {
    if (!bookmarkDisplayMode) {
      setSearchText('')
    }
    setBookmarkDisplayMode(!bookmarkDisplayMode)
  }

  const renderHeader = (): JSX.Element => {
    return (
      <View style={styles.headerContainer}>
        <SearchBar
          autoCapitalize={'none'}
          platform="ios"
          autoCorrect={false}
          clearIcon={{
            color: FOREGROUND_COLOUR_ALT,
            name: 'md-close',
          }}
          containerStyle={styles.searchBar}
          inputStyle={[styles.inputStyle, fontStyles.baseText]}
          placeholder={strings('Search')}
          style={styles.searchBar}
          cancelButtonProps={{
            color: FOREGROUND_COLOUR,
            buttonTextStyle: fontStyles.baseText,
          }}
          onChangeText={onChangeText}
          onClear={() => {
            onChangeText('')
            dismissKeyboard()
          }}
          value={searchText}
          showCancel={false}
        />

        <TouchableOpacity onPress={toggleBookmarkDisplay}>
          <Icon
            name={bookmarkDisplayMode ? 'bookmark' : 'bookmark-o'}
            size={28}
            color={FOREGROUND_COLOUR}
          />
        </TouchableOpacity>
      </View>
    )
  }

  const renderBody = (): JSX.Element => {
    return (
      <View style={{ flex: 1 }}>
        {bookmarkDisplayMode && !hasSearchText && <Text>Bookmarks</Text>}
        {!bookmarkDisplayMode && !hasSearchText && (
          <Text>Recents and Term of the Day</Text>
        )}
        {hasSearchText && <Text>Search results list</Text>}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={isLandscape ? BackgroundLandscape : BackgroundPortrait}
        style={styles.backgroundImageContainer}
        imageStyle={styles.backgroundImage}
      >
        {renderHeader()}
        {renderBody()}
      </ImageBackground>
    </View>
  )
}

export default withScreenLayout(DictionaryScreen, true)

import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
} from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import withScreenLayout, { Props } from '../common/withScreenLayout'
import {
  FOREGROUND_COLOUR_ALT,
  BACKGROUND_COLOUR,
  FOREGROUND_COLOUR,
} from '../theme/colours'
import { SearchBar } from 'react-native-elements'
import { strings } from '../locales/i18n'
import Icon from 'react-native-vector-icons/FontAwesome'
import { styles as fontStyles, Text, H1 } from '../common/text'
import ArticleInfo from '../data/ArticleInfo'
import Article from '../data/Article'
import ArticleView from './ArticleView'
import PurchaseHandler from '../purchase/PurchaseHandler'
import { AUDIO_PRODUCT } from '../purchase/PurchaseManager'
import TrackPlayer from 'react-native-track-player'
import { articleAudio } from '../audio/ArticleMedia'
import BookmarkInfo from '../data/BookmarkInfo'

const BackgroundPortrait = require('../images/background1P.png')
const BackgroundLandscape = require('../images/background1L.png')
const dismissKeyboard = require('react-native-dismiss-keyboard')

export interface IBookmarker {
  allBookmarks(): Promise<string[]>

  isBookmarked(term: string): Promise<boolean>

  toggleBookmark(term: string): Promise<boolean>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImageContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  backgroundImage: {
    alignContent: 'center',
    opacity: 0.35,
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
  articleList: {
    backgroundColor: 'transparent',
    flex: 1,
  },
})

const DictionaryScreen = ({
  orientation,
  navigation,
}): React.ReactElement<Props> => {
  const isLandscape = orientation === 'landscape'
  const [searchText, setSearchText] = useState('')
  const [displaySpinner, setDisplaySpinner] = useState<boolean>(false)
  const [articles, setArticles] = useState<Article[]>([])
  const hasSearchText = !!searchText.trim().length
  const [bookmarkDisplayMode, setBookmarkDisplayMode] = useState(false)

  const longRunningOpCallback = (longOpIsRunning: boolean) => {
    setDisplaySpinner(longOpIsRunning)
  }

  useEffect(() => {
    if (bookmarkDisplayMode) {
      displayBookmarkedArticles()
      setSearchText('')
    }
  }, [bookmarkDisplayMode])

  useEffect(() => {
    TrackPlayer.registerEventHandler(playerEventHandler)
  }, [])

  const displayBookmarkedArticles = async () => {
    const bookmarkedArticles = ArticleInfo.articlesForTerms(
      await BookmarkInfo.bookmarkTerms()
    )
    setArticles(bookmarkedArticles)
  }

  const filterArticlesWithoutAudio = (articles: Article[]) => {
    return articles.filter(article => {
      return articleAudio[article.name]
    })
  }

  const playerEventHandler = async () => {
    // Do nothing
  }

  useEffect(() => {
    let articles = ArticleInfo.allArticles()
    if (hasSearchText) {
      articles = ArticleInfo.articlesMatchingSearchTerm(searchText)
    }
    setArticles(articles)
  }, [searchText])

  const onChangeText = (value: string) => {
    if (value.trim().length) {
      setBookmarkDisplayMode(false)
    }
    setSearchText(value)
  }

  const toggleBookmarkDisplay = async () => {
    dismissKeyboard()
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

  const keyExtractor = item => item.name

  const playAudio = (name: string) => {
    const audioURI = articleAudio[name]

    if (!audioURI) {
      Alert.alert(
        'Error',
        `Audio file for ${name} not found`,
        [{ text: 'OK', onPress: () => {} }],
        { cancelable: false }
      )
      return
    }

    TrackPlayer.reset() // stops whatever is currently playing, clears audio queue
    TrackPlayer.setupPlayer().then(async () => {
      // Adds a track to the queue
      await TrackPlayer.add({
        id: name,
        title: name,
        url: audioURI,
        artist: 'KodokanPro',
      })
      TrackPlayer.play()
    })
  }

  const renderArticle = ({ item }: { item: Article }) => {
    const purchaseHandler = new PurchaseHandler(
      AUDIO_PRODUCT,
      (success: boolean) => {
        setDisplaySpinner(false)
        if (success) {
          playAudio(item.name)
        }
      },
      longRunningOpCallback
    )

    return (
      <ArticleView
        article={item}
        onPress={() => purchaseHandler.conditionalPlay()}
        navigation={navigation}
        onBookmarkToggle={isBookmarked => {
          if (!isBookmarked && bookmarkDisplayMode) {
            displayBookmarkedArticles()
          }
        }}
      />
    )
  }

  const renderList = (): JSX.Element => {
    return (
      <FlatList
        style={styles.articleList}
        data={filterArticlesWithoutAudio(articles)}
        renderItem={renderArticle}
        keyExtractor={keyExtractor}
        keyboardShouldPersistTaps={'always'}
        ListEmptyComponent={() => {
          if (!bookmarkDisplayMode) {
            return null
          }
          return (
            <Text
              style={{
                margin: 10,
              }}
            >
              No bookmarked terms. Add one by pressing{' '}
              <Icon name="bookmark-o" size={14} color={FOREGROUND_COLOUR} /> on
              the right side of the term.
            </Text>
          )
        }}
      />
    )
  }

  const renderBody = (): JSX.Element => {
    return (
      <View style={{ flex: 1 }}>
        {!bookmarkDisplayMode && !hasSearchText && (
          <Text>Recents and Term of the Day</Text>
        )}
        {bookmarkDisplayMode && (
          <H1
            style={{
              paddingLeft: 15,
              marginBottom: 10,
            }}
          >
            Bookmarks
          </H1>
        )}
        {(hasSearchText || bookmarkDisplayMode) && renderList()}
      </View>
    )
  }

  return (
    <ImageBackground
      source={isLandscape ? BackgroundLandscape : BackgroundPortrait}
      style={styles.backgroundImageContainer}
      imageStyle={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <Spinner
          visible={displaySpinner}
          textContent={'Contacting App Store...'}
          textStyle={{ color: 'white' }}
        />
        {renderHeader()}
        {renderBody()}
      </SafeAreaView>
    </ImageBackground>
  )
}

export default withScreenLayout(DictionaryScreen, true)

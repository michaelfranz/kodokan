import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  SectionList,
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
import { styles as fontStyles, Text, H1, H2 } from '../common/text'
import ArticleInfo from '../data/ArticleInfo'
import Article from '../data/Article'
import ArticleView from './ArticleView'
import PurchaseHandler from '../purchase/PurchaseHandler'
import { AUDIO_PRODUCT } from '../purchase/PurchaseManager'
import TrackPlayer from 'react-native-track-player'
import { articleAudio } from '../audio/ArticleMedia'
import BookmarkInfo from '../data/BookmarkInfo'
import TermsStore from '../data/TermsStore'

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

export interface IDictionaryState {
  searchText: string
  articles: Article[]
  bookmarkDisplayMode: boolean
  displaySpinner: boolean
  recentTerms: Article[]
  termOfTheDay: Article | undefined
}

const DictionaryScreen = ({
  orientation,
  navigation,
}): React.ReactElement<Props> => {
  const isLandscape = orientation === 'landscape'
  const [dictionaryState, setDictionaryState] = useState<IDictionaryState>({
    searchText: '',
    displaySpinner: false,
    articles: [],
    bookmarkDisplayMode: false,
    recentTerms: [],
    termOfTheDay: undefined,
  })
  const hasSearchText = !!dictionaryState.searchText.trim().length

  const longRunningOpCallback = (longOpIsRunning: boolean) => {
    setDictionaryState({ ...dictionaryState, displaySpinner: longOpIsRunning })
  }

  useEffect(() => {
    TrackPlayer.registerEventHandler(playerEventHandler)
    initRecentAndTermOfTheDay()
  }, [])

  const initRecentAndTermOfTheDay = async () => {
    const termOfTheDay = await TermsStore.termOfTheDay()
    const recentTerms = await TermsStore.recentTerms()
    const recentTermsWithArticles = ArticleInfo.articlesForTerms(recentTerms)
    setDictionaryState({
      ...dictionaryState,
      displaySpinner: false,
      termOfTheDay,
      recentTerms: recentTermsWithArticles,
    })
  }

  const loadRecentTerms = async () => {
    const recentTerms = await TermsStore.recentTerms()
    const recentTermsWithArticles = ArticleInfo.articlesForTerms(recentTerms)
    setDictionaryState({
      ...dictionaryState,
      displaySpinner: false,
      recentTerms: recentTermsWithArticles,
    })
  }

  const displayBookmarkedArticles = async () => {
    const bookmarkedArticles = ArticleInfo.articlesForTerms(
      await BookmarkInfo.bookmarkTerms()
    )
    setDictionaryState({ ...dictionaryState, articles: bookmarkedArticles })
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
    if (dictionaryState.bookmarkDisplayMode) {
      return
    }
    let articles: Article[] = []
    if (hasSearchText) {
      articles = ArticleInfo.articlesMatchingSearchTerm(
        dictionaryState.searchText
      )
    }
    setDictionaryState({ ...dictionaryState, articles })
  }, [dictionaryState.searchText])

  const onChangeText = (value: string) => {
    setDictionaryState({
      ...dictionaryState,
      bookmarkDisplayMode: dictionaryState.bookmarkDisplayMode
        ? false
        : dictionaryState.bookmarkDisplayMode,
      searchText: value,
    })
  }

  const toggleBookmarkDisplay = async () => {
    const nextState = {
      ...dictionaryState,
      bookmarkDisplayMode: !dictionaryState.bookmarkDisplayMode,
    }
    if (!dictionaryState.bookmarkDisplayMode) {
      const bookmarkedArticles = ArticleInfo.articlesForTerms(
        await BookmarkInfo.bookmarkTerms()
      )
      nextState.articles = bookmarkedArticles
      nextState.searchText = ''
    } else {
      nextState.articles = []
    }
    setDictionaryState({ ...nextState })
    dismissKeyboard()
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
          onCancel={() => {
            dismissKeyboard()
          }}
          value={dictionaryState.searchText}
          showCancel={false}
        />

        <TouchableOpacity onPress={toggleBookmarkDisplay}>
          <Icon
            name={
              dictionaryState.bookmarkDisplayMode ? 'bookmark' : 'bookmark-o'
            }
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

  const renderArticle = ({
    item,
    addToRecentsOnPlay,
    noBorder,
  }: {
    item: Article
    addToRecentsOnPlay?: boolean
    noBorder?: boolean
  }) => {
    const purchaseHandler = new PurchaseHandler(
      AUDIO_PRODUCT,
      async (success: boolean) => {
        setDictionaryState({
          ...dictionaryState,
          displaySpinner: false,
        })
        if (success) {
          if (addToRecentsOnPlay) {
            await TermsStore.addTermToRecent(item.name)
          }
          loadRecentTerms()
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
          if (!isBookmarked && dictionaryState.bookmarkDisplayMode) {
            displayBookmarkedArticles()
          }
        }}
        style={noBorder && { borderBottomWidth: 0 }}
      />
    )
  }

  const renderList = (): JSX.Element => {
    return (
      <FlatList
        style={styles.articleList}
        data={filterArticlesWithoutAudio(dictionaryState.articles)}
        renderItem={({ item }) =>
          renderArticle({ item, addToRecentsOnPlay: true })
        }
        keyExtractor={keyExtractor}
        keyboardShouldPersistTaps={'always'}
        ListEmptyComponent={() => {
          if (!dictionaryState.bookmarkDisplayMode) {
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
    const sections = [
      {
        title: 'Term of the Day',
        data: dictionaryState.termOfTheDay
          ? [dictionaryState.termOfTheDay]
          : [],
      },
      {
        title: 'Recent',
        data: dictionaryState.recentTerms,
      },
    ]

    return (
      <View style={{ flex: 1 }}>
        {!dictionaryState.bookmarkDisplayMode && !hasSearchText && (
          <SectionList
            sections={sections}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item, section }) => {
              if (!item) {
                return null
              }
              return renderArticle({
                item,
                noBorder: section.title !== 'Recent',
              })
            }}
            renderSectionHeader={({ section }) => {
              const { title } = section
              if (!section.data.length) {
                return null
              }
              return <H2 style={{ marginHorizontal: 15 }}>{title}</H2>
            }}
          />
        )}
        {dictionaryState.bookmarkDisplayMode && (
          <H1
            style={{
              paddingLeft: 15,
              marginBottom: 10,
            }}
          >
            Bookmarks
          </H1>
        )}
        {(hasSearchText || dictionaryState.bookmarkDisplayMode) && renderList()}
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
          visible={dictionaryState.displaySpinner}
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

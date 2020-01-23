// noinspection TsLint
import React, { useState, useEffect } from 'react'

import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Article from '../data/Article'
import { FOREGROUND_COLOUR } from '../theme/colours'
import BookmarkInfo from '../data/BookmarkInfo'
import useIsMounted from 'ismounted'
import { Text, H2 } from '../common/text'

const ImageDictGokyo = require('../images/dict-gokyo.png')
const ImageDictWaza = require('../images/dict-waza.png')
const ImageDictGi = require('../images/dict-gi.png')
const dismissKeyboard = require('react-native-dismiss-keyboard')

const styles = StyleSheet.create({
  techniqueContainer: {
    borderBottomColor: 'rgb(199,200,204)',
    borderBottomWidth: 1,
    justifyContent: 'flex-start',
    paddingBottom: 6,
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 6,
  },
  techniqueNameText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  translationText: {
    fontSize: 14,
  },
})

export interface IProps {
  article: Article
  onPress: () => void
  navigation?: any
  style?: any
  onBookmarkToggle: (isBookmarked: boolean) => void
}

const ArticleView = ({
  style,
  onPress,
  article,
  navigation,
  onBookmarkToggle,
}: IProps): React.ReactElement<IProps> => {
  const isMounted = useIsMounted()
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false)
  const showScreen = (screen: string, term: string) => {
    alert('no action for now')
    dismissKeyboard()
    return

    const { navigate } = navigation
    navigate(screen, { term })
  }

  useEffect(() => {
    const term = article.name
    BookmarkInfo.isBookmarked(term).then(value => {
      if (isMounted) {
        setIsBookmarked(value)
      }
    })
  }, [])

  const renderNaviButton = (
    show: boolean,
    screen: string,
    term: string,
    image
  ) => {
    return show ? (
      <TouchableOpacity
        style={{ paddingRight: 8 }}
        onPress={() => showScreen(screen, term)}
      >
        <Image source={image} />
      </TouchableOpacity>
    ) : (
      <Text />
    )
  }

  const toggleBookmark = async () => {
    const term = article.name
    const isBookmarked = await BookmarkInfo.isBookmarked(term)
    if (isBookmarked) {
      await BookmarkInfo.removeBookmarkTerm(term)
    } else {
      await BookmarkInfo.addBookmarkTerm(term)
    }
    dismissKeyboard()
    onBookmarkToggle(!isBookmarked)
    setIsBookmarked(!isBookmarked)
  }

  const renderBookmarkButton = () => {
    return (
      <TouchableOpacity onPress={toggleBookmark}>
        <Text style={{ margin: 8, fontSize: 15, textAlign: 'left' }}>
          <Icon
            name={isBookmarked ? 'bookmark' : 'bookmark-o'}
            size={20}
            color={FOREGROUND_COLOUR}
          />
        </Text>
      </TouchableOpacity>
    )
  }

  const { isGokyo, isWaza, isWazaClassification, isGiTerm, name } = article

  const gokyoButton = renderNaviButton(isGokyo, 'Gokyo', name, ImageDictGokyo)
  const wazaButton = renderNaviButton(
    isWaza || isWazaClassification,
    'Waza',
    name,
    ImageDictWaza
  )
  const giButton = renderNaviButton(isGiTerm, 'Gi', name, ImageDictGi)
  const bookmarkButton = renderBookmarkButton()

  return (
    <View
      style={[
        styles.techniqueContainer,
        style,
        {
          alignItems: 'center',
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
      ]}
    >
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center' }}
        onPress={onPress}
      >
        <Icon name="volume-up" size={28} color={FOREGROUND_COLOUR} />
        <View style={{ paddingLeft: 4 }}>
          <H2 style={styles.techniqueNameText}>{article.displayName}</H2>
          <Text style={styles.translationText}>{article.translation}</Text>
        </View>
      </TouchableOpacity>
      <View
        style={{
          alignItems: 'center',
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}
      >
        {gokyoButton}
        {wazaButton}
        {giButton}
        {bookmarkButton}
      </View>
    </View>
  )
}

export default ArticleView

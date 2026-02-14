import React, { useState, useEffect, useRef } from 'react'

import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Article from '../data/Article'
import { FOREGROUND_COLOUR } from '../theme/colours'
import BookmarkInfo from '../data/BookmarkInfo'
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
  const isMountedRef = useRef(true)
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false)

  useEffect(() => {
    return () => { isMountedRef.current = false }
  }, [])

  const showScreen = (screen: string, term: string) => {
    dismissKeyboard()
    const { navigate } = navigation
    navigate(screen, { term })
  }

  const ICON_WIDTH = 32

  useEffect(() => {
    const term = article.name
    BookmarkInfo.isBookmarked(term).then(value => {
      if (isMountedRef.current) {
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
        key={screen}
        style={{ width: ICON_WIDTH }}
        onPress={() => showScreen(screen, term)}
      >
        <Image source={image} />
      </TouchableOpacity>
    ) : null
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
      <TouchableOpacity key="bookmark" onPress={toggleBookmark}>
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
    'WazaClassificationScreen',
    name,
    ImageDictWaza
  )
  const giButton = renderNaviButton(isGiTerm, 'Gi', name, ImageDictGi)
  const bookmarkButton = renderBookmarkButton()

  const actionIcons = [
    gokyoButton,
    wazaButton,
    giButton,
    bookmarkButton,
  ].filter(actionIcon => !!actionIcon)

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
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
          paddingRight: 5,
        }}
        onPress={onPress}
      >
        <Icon name="volume-up" size={28} color={FOREGROUND_COLOUR} />
        <View style={{ paddingLeft: 4, flex: 1 }}>
          <H2 numberOfLines={1} style={styles.techniqueNameText}>
            {article.displayName}
          </H2>
          <Text numberOfLines={1} style={styles.translationText}>
            {article.translation}
          </Text>
        </View>
      </TouchableOpacity>
      <View
        style={{
          alignItems: 'center',
          width: actionIcons.length * ICON_WIDTH,
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}
      >
        {actionIcons.map(actionIcon => actionIcon)}
      </View>
    </View>
  )
}

export default ArticleView

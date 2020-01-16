// noinspection TsLint
import * as React from 'react'

import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Article from '../data/Article'
import { FOREGROUND_COLOUR } from '../theme/colours'

const ImageDictGokyo = require('../images/dict-gokyo.png')
const ImageDictWaza = require('../images/dict-waza.png')
const ImageDictGi = require('../images/dict-gi.png')

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
    fontFamily: 'AmericanTypewriter',
    fontSize: 18,
    fontWeight: 'bold',
  },
  translationText: {
    fontFamily: 'AmericanTypewriter',
    fontSize: 14,
  },
})

export interface IProps {
  article: Article
  onPress: () => void
  navigation?: any
  style?: any
}

const ArticleView = ({
  style,
  onPress,
  article,
  navigation,
}: IProps): React.ReactElement<IProps> => {
  const showScreen = (screen: string, term: string) => {
    alert('no action for now')
    return

    const { navigate } = navigation
    navigate(screen, { term })
  }

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

  const { isGokyo, isWaza, isWazaClassification, isGiTerm, name } = article

  const gokyoButton = renderNaviButton(isGokyo, 'Gokyo', name, ImageDictGokyo)
  const wazaButton = renderNaviButton(
    isWaza || isWazaClassification,
    'Waza',
    name,
    ImageDictWaza
  )
  const giButton = renderNaviButton(isGiTerm, 'Gi', name, ImageDictGi)

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
          <Text style={styles.techniqueNameText}>{article.displayName}</Text>
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
      </View>
    </View>
  )
}

export default ArticleView

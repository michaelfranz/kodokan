import React, { useState, useEffect } from 'react'
import {
  SafeAreaView,
  ImageBackground,
  StyleSheet,
  FlatList,
} from 'react-native'
import withScreenLayout from '../common/withScreenLayout'
import ArticleInfo from '../data/ArticleInfo'
import TechniqueInfo from '../data/WazaInfo'
import { View, TouchableOpacity } from 'react-native'
import { H2, Text } from '../common/text'
import { PRIMARY_COLOUR } from '../theme/colours'
import Color from 'color'

const BackgroundPortrait = require('../images/background3P.png')
const BackgroundLandscape = require('../images/background3L.png')

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    backgroundColor: 'transparent',
    flex: 1,
    marginTop: 20,
  },
  backgroundImageContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  backgroundImage: {
    alignContent: 'center',
    opacity: 0.15,
    resizeMode: 'cover',
  },
  wazaClassificationList: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  techniqueContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'rgb(199,200,204)',
    borderBottomWidth: 1,
    justifyContent: 'flex-start',
    padding: 6,
  },
})

interface IProps {
  orientation: 'landscape' | 'portrait'
  navigation: any
}

interface IState {
  classification?: string
  selectedTechnique?: string
}

const WazaScreen = ({
  orientation,
  navigation,
}): React.ReactElement<IProps> => {
  const isLandscape = orientation === 'landscape'
  const [state, setState] = useState<IState>({})

  const techniqueInfo = TechniqueInfo.getInstance()

  useEffect(() => {
    const unsubscribe = navigation.addListener('didFocus', () => {
      setStateFromParams()
    })

    setStateFromParams()

    return () => {
      unsubscribe.remove()
    }
  }, [navigation.state.params])

  useEffect(() => {
    if (state.selectedTechnique && state.classification) {
      showDetails(state.classification)
    }
  }, [state.selectedTechnique])

  const setStateFromParams = () => {
    const { params = {} } = navigation.state
    if (!params) {
      setState({
        classification: undefined,
        selectedTechnique: undefined,
      })
      return
    }
    const { term } = params
    if (techniqueInfo.isClassification(term)) {
      setState({
        classification: term,
        selectedTechnique: undefined,
      })
      return
    }
    if (techniqueInfo.isWazaTerm(term)) {
      const classification = techniqueInfo.classificationForWazaTerm(term)
      setState({
        classification,
      })
      const callback = () => {
        setState({
          classification,
          selectedTechnique: term,
        })
      }
      setTimeout(callback, 700)
    }
  }

  const showDetails = (classification: string) => {
    const { selectedTechnique } = state
    const selectedTechniqueCopy = selectedTechnique
    setState({ classification: undefined, selectedTechnique: undefined })
    navigation.setParams({ term: null })
    navigation.navigate('WazaClassificationDetailScreen', {
      classification,
      selectedTechnique: selectedTechniqueCopy,
    })
  }

  const renderItem = ({ item }) => {
    const { classification } = state
    const isSelected = classification === item
    const article = ArticleInfo.articleForTerm(item)
    const backgroundColor = Color(PRIMARY_COLOUR)
      .alpha(0.6)
      .hsl()
      .toString()
    if (!article) {
      return null
    }
    return (
      <TouchableOpacity
        style={[
          styles.techniqueContainer,
          isSelected ? { backgroundColor } : {},
        ]}
        onPress={() => showDetails(item)}
      >
        <H2>{article.displayName}</H2>
        <Text>{article.translation}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <ImageBackground
      source={isLandscape ? BackgroundLandscape : BackgroundPortrait}
      style={styles.backgroundImageContainer}
      imageStyle={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.innerContainer}>
          <FlatList
            style={styles.wazaClassificationList}
            data={techniqueInfo.wazaClassifications()}
            renderItem={renderItem}
            keyExtractor={item => item}
            extraData={state}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  )
}

export default withScreenLayout(WazaScreen)

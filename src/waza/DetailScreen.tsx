import React, { useState, useEffect } from 'react'
import { View, ImageBackground, StyleSheet, SafeAreaView } from 'react-native'
import withScreenLayout from '../common/withScreenLayout'
import TechniqueInfo from '../data/WazaInfo'
import { FlatList } from 'react-native-gesture-handler'
import ArticleInfo from '../data/ArticleInfo'
import TechniqueView from '../video/TechniqueView'

interface IProps {
  navigation: any
  orientation: 'landscape' | 'portrait'
}

interface IState {
  classification?: string | undefined
  isSpinnerVisible?: boolean
  selectedTechnique?: string | undefined
}

const dismissKeyboard = require('react-native-dismiss-keyboard')
const BackgroundPortrait = require('../images/background4P.png')
const BackgroundLandscape = require('../images/background4L.png')

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    backgroundColor: 'transparent',
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
  wazaList: {
    flex: 1,
  },
})

const WazaDetailScreen = ({
  orientation,
  navigation,
}): React.ReactElement<IProps> => {
  const isLandscape = orientation === 'landscape'
  const [state, setState] = useState<IState>({})
  const techniqueInfo = TechniqueInfo.getInstance()
  const { classification } = state
  const wazaList = classification
    ? techniqueInfo.wazaForClassificationTerm(classification)
    : []

  useEffect(() => {
    setStateFromParams()
  }, [])

  const setStateFromParams = () => {
    const { state } = navigation
    const { params } = state
    const { classification, selectedTechnique } = params

    dismissKeyboard()
    setState({
      classification,
      selectedTechnique,
    })
  }

  const renderTechnique = ({ item }) => {
    const article = ArticleInfo.articleForTerm(item)
    if (!article) {
      return null
    }

    const { name, displayName, translation } = article
    return (
      <TechniqueView
        isSelected={name === state.selectedTechnique}
        displayName={displayName}
        techniqueName={name}
        translation={translation}
        onPress={() => alert('no action for now')}
      />
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
            style={styles.wazaList}
            data={wazaList}
            renderItem={renderTechnique}
            keyExtractor={item => item}
            extraData={state}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  )
}

export default withScreenLayout(WazaDetailScreen)

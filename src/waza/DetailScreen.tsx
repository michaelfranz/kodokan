import React, { useState, useEffect } from 'react'
import { View, ImageBackground, StyleSheet, SafeAreaView } from 'react-native'
import withScreenLayout from '../common/withScreenLayout'
import TechniqueInfo from '../data/WazaInfo'
import { FlatList } from 'react-native-gesture-handler'
import ArticleInfo from '../data/ArticleInfo'
import TechniqueView from '../video/TechniqueView'
import PurchaseHandler from '../purchase/PurchaseHandler'
import { VIDEO_PRODUCT } from '../purchase/PurchaseManager'
import { videoMap } from '../data/VideoInfo'

interface IProps {
  navigation: any
  orientation: 'landscape' | 'portrait'
  isOnline: boolean | null
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
    opacity: 0.2,
    resizeMode: 'cover',
  },
  wazaList: {
    flex: 1,
  },
})

const WazaDetailScreen = ({
  orientation,
  navigation,
  isOnline,
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
    const { params } = navigation.state
    const { classification, selectedTechnique } = params

    dismissKeyboard()
    setState({
      ...state,
      classification,
      selectedTechnique,
    })
  }

  const longRunningOpCallback = (longOpIsRunning: boolean) => {
    setState({ ...state, isSpinnerVisible: longOpIsRunning })
  }

  const showVideoScreen = uri => {
    setState({
      ...state,
      selectedTechnique: undefined,
    })
    const { navigate } = navigation
    navigate('VideoScreen', { uri })
  }

  const renderTechnique = ({ item }) => {
    const article = ArticleInfo.articleForTerm(item)
    if (!article) {
      return null
    }

    const { name, displayName, translation } = article

    const purchaseHandler = new PurchaseHandler(
      VIDEO_PRODUCT,
      () => {
        setState({
          ...state,
          isSpinnerVisible: false,
        })
        const video = videoMap.get(item)
        video!.uri().then(result => {
          showVideoScreen(result)
        })
      },
      longRunningOpCallback
    )

    return (
      <TechniqueView
        isSelected={name === state.selectedTechnique}
        displayName={displayName}
        techniqueName={name}
        translation={translation}
        onPress={() => {
          purchaseHandler.conditionalPlay()
        }}
        isOnline={isOnline}
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

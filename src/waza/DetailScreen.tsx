import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native'
import withScreenLayout from '../common/withScreenLayout'
import TechniqueInfo from '../data/WazaInfo'
import ArticleInfo from '../data/ArticleInfo'
import TechniqueView from '../video/TechniqueView'
import { videoMap } from '../data/VideoInfo'

interface IProps {
  navigation: any
  route?: any
  orientation: 'landscape' | 'portrait'
  isOnline: boolean | null
}

interface IState {
  classification?: string | undefined
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
  route,
  isOnline,
}): React.ReactElement<IProps> => {
  const isLandscape = orientation === 'landscape'
  const [state, setState] = useState<IState>({})
  const techniqueInfo = TechniqueInfo.getInstance()
  const { classification } = state
  const wazaList = classification
    ? techniqueInfo.wazaForClassificationTerm(classification)
    : []

  const ListEl = useRef<FlatList>(null)

  useEffect(() => {
    setStateFromParams()
  }, [route?.params])

  useEffect(() => {
    setTimeout(() => {
      if (state.selectedTechnique) {
        const index = wazaList.indexOf(state.selectedTechnique)
        scrollListToIndex(index)
      }
    }, 200)
  }, [state.selectedTechnique])

  const setStateFromParams = () => {
    const params = route?.params || {}
    const { classification, selectedTechnique } = params

    dismissKeyboard()
    setState({
      ...state,
      classification,
      selectedTechnique,
    })
  }

  const scrollListToIndex = (index: number): void => {
    ListEl.current!.scrollToIndex({
      index,
      animated: true,
    })
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

    return (
      <TechniqueView
        isSelected={name === state.selectedTechnique}
        displayName={displayName}
        techniqueName={name}
        translation={translation}
        onPress={() => {
          setState({
            ...state,
            selectedTechnique: undefined,
          })
          const video = videoMap.get(item)
          video!.uri().then(result => {
            showVideoScreen(result)
          })
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
            ref={ListEl}
            style={styles.wazaList}
            data={wazaList}
            renderItem={renderTechnique}
            keyExtractor={item => item}
            extraData={state}
            onScrollToIndexFailed={info => {
              const wait = new Promise(resolve => setTimeout(resolve, 300))
              wait.then(() => {
                scrollListToIndex(info.index)
              })
            }}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  )
}

export default withScreenLayout(WazaDetailScreen)

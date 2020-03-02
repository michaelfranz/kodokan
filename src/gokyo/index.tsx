import React, { useState, useEffect } from 'react'
import {
  View,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native'
import withScreenLayout from '../common/withScreenLayout'
import { H3 } from '../common/text'
import Spinner from 'react-native-loading-spinner-overlay'
import { PRIMARY_COLOUR } from '../theme/colours'
import TechniqueInfo from '../data/WazaInfo'
import TechniqueView from '../video/TechniqueView'
import { VIDEO_PRODUCT } from '../purchase/PurchaseManager'
import { videoMap } from '../data/VideoInfo'
import ArticleInfo from '../data/ArticleInfo'
import PurchaseHandler from '../purchase/PurchaseHandler'

const BackgroundLandscape = require('../images/background2L.png')
const BackgroundPortrait = require('../images/background2P.png')
const dismissKeyboard = require('react-native-dismiss-keyboard')

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
    opacity: 0.15,
    resizeMode: 'cover',
  },
  GO: {
    backgroundColor: 'rgb(243,255,20)',
  },
  IK: {
    backgroundColor: 'rgb(220,58,13)',
  },
  NI: {
    backgroundColor: 'rgb(18,88,220)',
  },
  SAN: {
    backgroundColor: 'rgb(28,220,13)',
  },
  YON: {
    backgroundColor: 'rgb(220,134,13)',
  },
  kyoSelector: {
    borderRadius: 26,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  kyoSelectorBar: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 5,
    paddingBottom: 5,
  },
  kyoSelectorText: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  kyoSelectorTextWhite: {
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  techniqueList: {
    flexDirection: 'column',
    flex: 1,
  },
})

interface IProps {
  orientation: 'landscape' | 'portrait'
  navigation: any
  isOnline: boolean | null
}

interface IState {
  isLoading: boolean
  currentKyo: KYO
  selectedTechnique?: string | undefined
}

type KYO = string

const techniqueInfo = TechniqueInfo.getInstance()

const GokyoScreen = ({
  orientation,
  navigation,
}): React.ReactElement<IProps> => {
  const isLandscape = orientation === 'landscape'
  const [state, setState] = useState<IState>({
    isLoading: false,
    currentKyo: 'GO',
  })
  const techniqueNames = techniqueInfo.wazaForKyo(state.currentKyo)

  useEffect(() => {
    setStateFromParams()
  }, [])

  const setStateFromParams = () => {
    const { params = {} } = navigation.state
    const { selectedTechnique } = params

    dismissKeyboard()
    if (params) {
      const currentKyo: KYO = selectedTechnique
        ? techniqueInfo.kyoForKyoWazaTerm(selectedTechnique)
        : state.currentKyo
      setState({
        ...state,
        currentKyo,
        selectedTechnique,
      })
    } else {
      setState({
        ...state,
        currentKyo: 'GO',
        selectedTechnique: undefined,
      })
    }
  }

  const onPressKyoButton = (kyo: KYO) => {
    setState({
      ...state,
      currentKyo: kyo,
    })
  }

  const renderKyoSelector = () => {
    const kyoNames: KYO[] = ['GO', 'YON', 'SAN', 'NI', 'IK']
    const kyoStyles = [styles.GO, styles.YON, styles.SAN, styles.NI, styles.IK]
    const kyoTextStyles = [
      styles.kyoSelectorText,
      styles.kyoSelectorText,
      styles.kyoSelectorText,
      styles.kyoSelectorTextWhite,
      styles.kyoSelectorTextWhite,
    ]
    return (
      <View style={styles.kyoSelectorBar}>
        {kyoNames.map((name, i) => {
          const selectedButtonStyle =
            name === state.currentKyo
              ? { borderColor: PRIMARY_COLOUR, borderWidth: 2 }
              : {}
          return (
            <TouchableOpacity
              key={name}
              style={[selectedButtonStyle, styles.kyoSelector, kyoStyles[i]]}
              onPress={() => onPressKyoButton(name)}
            >
              <H3 style={kyoTextStyles[i]}>{name}</H3>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  const showVideoScreen = uri => {
    setState({
      ...state,
    })
    const { navigate } = navigation
    navigate('VideoScreen', { uri })
  }

  const longRunningOpCallback = (longOpIsRunning: boolean) => {
    setState({ ...state, isLoading: longOpIsRunning })
  }

  const renderTechnique = techniqueName => {
    const article = ArticleInfo.articleForTerm(techniqueName)
    if (!article) {
      return null
    }
    const { name, displayName, translation } = article

    const purchaseHandler = new PurchaseHandler(
      VIDEO_PRODUCT,
      () => {
        setState({
          ...state,
          isLoading: false,
        })
        const video = videoMap.get(techniqueName)
        video!.uri().then(result => {
          showVideoScreen(result)
        })
      },
      longRunningOpCallback
    )

    return (
      <TechniqueView
        isOnline
        isSelected={name === state.selectedTechnique}
        techniqueName={name}
        displayName={displayName}
        translation={translation}
        onPress={() => purchaseHandler.conditionalPlay()}
        key={techniqueName}
      />
    )
  }

  const renderPortraitBody = () => {
    return (
      <View style={styles.techniqueList}>
        {techniqueNames.map(name => renderTechnique(name))}
      </View>
    )
  }

  const splitTechniqueNames = (techniqueNames: string[]): any => {
    const techniqueNamesLeft: String[] = []
    const techniqueNamesRight: String[] = []
    techniqueNames.forEach((techniqueName, index) => {
      if (index % 2 === 0) {
        techniqueNamesLeft.push(techniqueName)
      } else {
        techniqueNamesRight.push(techniqueName)
      }
    })
    return { techniqueNamesLeft, techniqueNamesRight }
  }

  const renderLandscapeBody = () => {
    const { techniqueNamesLeft, techniqueNamesRight } = splitTechniqueNames(
      techniqueNames
    )
    return (
      <View style={[{ flexDirection: 'row' }]}>
        <View style={[styles.techniqueList, { flex: 0.5 }]}>
          {techniqueNamesLeft.map(name => renderTechnique(name))}
        </View>
        <View style={[styles.techniqueList, { flex: 0.5 }]}>
          {techniqueNamesRight.map(name => renderTechnique(name))}
        </View>
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
          visible={state.isLoading}
          textContent={'Contacting App Store...'}
          textStyle={{ color: 'white' }}
        />
        <View style={styles.innerContainer}>
          {renderKyoSelector()}
          {isLandscape ? renderLandscapeBody() : renderPortraitBody()}
        </View>
      </SafeAreaView>
    </ImageBackground>
  )
}

export default withScreenLayout(GokyoScreen)

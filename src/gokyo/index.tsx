import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from 'react-native'
import withScreenLayout from '../common/withScreenLayout'
import { H3 } from '../common/text'
import Spinner from 'react-native-loading-spinner-overlay'
import { PRIMARY_COLOUR, GO, IK, NI, SAN, YON } from '../theme/colours'
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
    flex: 1,
    justifyContent: 'space-between',
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
    backgroundColor: GO,
  },
  IK: {
    backgroundColor: IK,
  },
  NI: {
    backgroundColor: NI,
  },
  SAN: {
    backgroundColor: SAN,
  },
  YON: {
    backgroundColor: YON,
  },
  kyoSelector: {
    borderRadius: 26,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  kyoSelectorBar: {
    backgroundColor: 'transparent',
    borderBottomColor: 'rgb(199,200,204)',
    borderBottomWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 12,
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
  },
})

interface IProps {
  orientation: 'landscape' | 'portrait'
  navigation: any
  isOnline: boolean | null
}

interface IState {
  isLoading: boolean
  currentKyo: KYO | null
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
    currentKyo: null,
  })

  const ListEl = useRef<FlatList<any>>(null)
  const allKyoWazaTerms = Array.from(techniqueInfo.kyoWazaTerms)

  useEffect(() => {
    setStateFromParams()
  }, [])

  const setStateFromParams = () => {
    const { params = {} } = navigation.state
    const { selectedTechnique } = params

    dismissKeyboard()
    if (params) {
      const currentKyo: KYO | null = selectedTechnique
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
        currentKyo: null,
        selectedTechnique: undefined,
      })
    }
  }

  const onPressKyoButton = (kyo: KYO) => {
    const isCurrentKyo = kyo === state.currentKyo
    if (!isCurrentKyo) {
      const kyoFirstItemIndices = {
        GO: 0,
        YON: 8,
        SAN: 16,
        NI: 24,
        IK: 32,
      }
      ListEl.current!.scrollToIndex({
        index: isLandscape
          ? kyoFirstItemIndices[kyo] / 2
          : kyoFirstItemIndices[kyo],
        animated: true,
      })
    }
    setState({
      ...state,
      currentKyo: isCurrentKyo ? null : kyo,
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
    const { name, displayName, translation, kyo } = article
    const isInactive = state.currentKyo ? state.currentKyo !== kyo : false

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
        onPress={() => {
          if (isInactive) {
            setState({ ...state, currentKyo: null })
            return
          }
          purchaseHandler.conditionalPlay()
        }}
        key={techniqueName}
        renderKyoIndicator
        containerStyles={{
          opacity: isInactive ? 0.5 : 1,
          borderBottomColor: 'rgb(199,200,204)',
          borderBottomWidth: isLandscape ? 0 : 1,
        }}
        disableDownload={isInactive}
      />
    )
  }

  const splitItemsIntoChunks = (items: String[], chunkCount: number) => {
    let index = 0
    const newArray: Array<String[]> = []
    while (index < items.length) {
      const chunk = items.slice(index, index + chunkCount)
      newArray.push(chunk)
      index += chunkCount
    }

    return newArray
  }

  const renderTechniqueRow = row => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          borderBottomColor: 'rgb(199,200,204)',
          borderBottomWidth: 1,
        }}
      >
        {row.item.map(technique => renderTechnique(technique))}
      </View>
    )
  }

  const renderList = () => {
    const data = isLandscape
      ? splitItemsIntoChunks(allKyoWazaTerms, 2)
      : allKyoWazaTerms

    return (
      <FlatList
        key={isLandscape ? 'landscapeList' : 'portraitList'}
        numColumns={1}
        ref={ListEl}
        style={styles.techniqueList}
        data={data}
        renderItem={item =>
          isLandscape ? renderTechniqueRow(item) : renderTechnique(item.item)
        }
        keyExtractor={item => item}
        extraData={state}
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
        <Spinner
          visible={state.isLoading}
          textContent={'Contacting App Store...'}
          textStyle={{ color: 'white' }}
        />
        <View style={styles.innerContainer}>
          {renderKyoSelector()}
          {renderList()}
        </View>
      </SafeAreaView>
    </ImageBackground>
  )
}

export default withScreenLayout(GokyoScreen)

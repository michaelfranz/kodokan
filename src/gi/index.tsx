import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Image,
  StyleSheet,
  Easing,
  TouchableOpacity,
  Animated,
} from 'react-native'
import GiInfo, { baseImageDimensions } from '../data/GiInfo'
import withScreenLayout from '../common/withScreenLayout'
import Icon from 'react-native-vector-icons/FontAwesome'
import Hotspot from '../data/Hotspot'
import ArticleInfo from '../data/ArticleInfo'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PRIMARY_COLOUR } from '../theme/colours'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'
import { H3, H2 } from '../common/text'

const ImageBack = require('../images/hanspi-back.png')
const ImageFront = require('../images/hanspi-front.png')

const styles = StyleSheet.create({
  hotspotsContainer: {
    position: 'relative',
    zIndex: 123,
  },
  screenTop: {
    flexDirection: 'row',
    height: 55,
    width: '100%',
    alignItems: 'center',
  },
  rotateButton: {
    paddingHorizontal: 10,
    marginRight: 10,
  },
  container: {
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flex: 1,
    position: 'relative',
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    resizeMode: 'contain',
    alignSelf: 'center',
    position: 'absolute',
  },
  techniqueContainer: {
    padding: 5,
    paddingHorizontal: 20,
    flex: 1,
  },
  techniqueContainerText: {
    color: 'white',
  },
})

interface IProps {
  orientation: 'landscape' | 'portrait'
  navigation: any
}

interface IState {
  isFront: boolean
  imageWidth: number
  imageHeight: number
  term: string | null
}

const giInfo = GiInfo.getInstance()

const GiScreen = (): React.ReactElement<IProps> => {
  const [state, setState] = useState<IState>({
    isFront: true,
    imageHeight: 0,
    imageWidth: 0,
    term: null,
  })

  const animatedOpacityValue = useRef<Animated.Value>(new Animated.Value(0))
    .current

  const animatedHotspotValue = useRef<Animated.Value>(new Animated.Value(0))
    .current

  useEffect(() => {
    if (state.term) {
      animateHotspots()
    }
  }, [state.term])

  useEffect(() => {
    animatedHotspotValue.setValue(0)
    setState({
      ...state,
      term: null,
    })
  }, [state.isFront])

  const isBigRadius = state.imageHeight > 650
  const hotspotRadius = isBigRadius ? 10 : 5

  const animateHotspots = () => {
    animatedHotspotValue.setValue(0)
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedHotspotValue, {
          duration: 800,
          easing: Easing.linear,
          toValue: 0,
          useNativeDriver: false,
        }),
        Animated.timing(animatedHotspotValue, {
          duration: 800,
          easing: Easing.linear,
          toValue: 1,
          useNativeDriver: false,
        }),
      ])
    ).start()
  }

  const renderHotspot = (hotspot: Hotspot) => {
    const { imageHeight, imageWidth } = state
    const highlighted = hotspot.term === state.term

    const left = (hotspot.x / 100) * imageWidth
    const top = (hotspot.y / 100) * imageHeight

    let marginOffsetLeft
    let marginOffsetTop
    let width
    let height
    let borderRadius

    if (highlighted) {
      marginOffsetLeft = animatedHotspotValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, -hotspotRadius, 0],
      })
      marginOffsetTop = animatedHotspotValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, -hotspotRadius, 0],
      })
      width = animatedHotspotValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [hotspotRadius * 2, hotspotRadius * 4, hotspotRadius * 2],
      })

      height = animatedHotspotValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [hotspotRadius * 2, hotspotRadius * 4, hotspotRadius * 2],
      })

      borderRadius = animatedHotspotValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [hotspotRadius, hotspotRadius * 2, hotspotRadius],
      })
    } else {
      marginOffsetLeft = 0
      marginOffsetTop = 0
      width = hotspotRadius * 2
      height = hotspotRadius * 2
      borderRadius = hotspotRadius
    }

    const hitSlop = isBigRadius ? 12 : 6

    return (
      <View
        key={hotspot.term}
        style={{
          left,
          opacity: 0.7,
          position: 'absolute',
          top,
          zIndex: 2,
        }}
      >
        <TouchableOpacity
          hitSlop={{
            top: hitSlop,
            left: hitSlop,
            bottom: hitSlop,
            right: hitSlop,
          }}
          onPress={() => {
            show(hotspot.term)
            ReactNativeHapticFeedback.trigger('impactMedium', {
              enableVibrateFallback: true,
              ignoreAndroidSystemSettings: false,
            })
          }}
        >
          <Animated.View
            style={{
              backgroundColor: PRIMARY_COLOUR,
              borderRadius,
              height,
              marginLeft: marginOffsetLeft,
              marginTop: marginOffsetTop,
              width,
            }}
          />
        </TouchableOpacity>
      </View>
    )
  }

  const fadeOutCurrentTerm = (callback: () => void) => {
    animatedOpacityValue.setValue(1)
    Animated.timing(animatedOpacityValue, {
      toValue: 0,
      easing: Easing.linear,
      duration: state.term ? 300 : 0, // no delay if current term undefined
      useNativeDriver: false,
    }).start(callback)
  }

  const fadeInNewTerm = () => {
    animatedOpacityValue.setValue(0)
    Animated.timing(animatedOpacityValue, {
      duration: 300,
      easing: Easing.linear,
      toValue: 1,
      useNativeDriver: false,
    }).start()
  }

  const show = (term: string) => {
    if (term === state.term) {
      return
    }
    if (giInfo.isGiTerm(term)) {
      fadeOutCurrentTerm(() => {
        animatedHotspotValue.setValue(0)
        setState({
          ...state,
          term,
        })
        setTimeout(() => {
          fadeInNewTerm()
        }, 300)
      })
    }
  }

  const renderedHotspots = giInfo
    .hotspots(state.isFront)
    .map((hotspot) => renderHotspot(hotspot))

  const onImageContainerLayout = (event) => {
    const { height } = event.nativeEvent.layout
    const imageHeightToWidthRatio =
      baseImageDimensions.width / baseImageDimensions.height

    setState({
      ...state,
      imageHeight: height,
      imageWidth: height * imageHeightToWidthRatio,
    })
  }

  const renderTechniqueLabels = () => {
    const { term } = state
    const article = ArticleInfo.articleForTerm(term || '')

    const opacity = animatedOpacityValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    })

    return (
      <Animated.View style={[styles.techniqueContainer, { opacity }]}>
        <H2 style={styles.techniqueContainerText}>{term}</H2>
        {article && (
          <H3 style={styles.techniqueContainerText}>{article.translation}</H3>
        )}
      </Animated.View>
    )
  }

  const renderImageRotateButton = () => {
    return (
      <TouchableOpacity
        style={styles.rotateButton}
        onPress={() => setState({ ...state, isFront: !state.isFront })}
      >
        <Icon name="repeat" size={28} color="white" />
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenTop}>
        {renderTechniqueLabels()}
        {renderImageRotateButton()}
      </View>
      <View style={styles.innerContainer} onLayout={onImageContainerLayout}>
        <Image
          source={state.isFront ? ImageFront : ImageBack}
          style={[
            styles.backgroundImage,
            { width: state.imageWidth, height: state.imageHeight },
          ]}
          resizeMode="contain"
        />
        <View
          style={[
            styles.hotspotsContainer,
            { width: state.imageWidth, height: state.imageHeight },
          ]}
        >
          {renderedHotspots}
        </View>
      </View>
    </SafeAreaView>
  )
}

export default withScreenLayout(GiScreen, true)

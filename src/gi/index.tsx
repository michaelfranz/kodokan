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
import Hotspot from '../data/Hotspot'
import ArticleInfo from '../data/ArticleInfo'
import { SafeAreaView, AnimatedValue } from 'react-navigation'
import { PRIMARY_COLOUR } from '../theme/colours'
import { H3, H2 } from '../common/text'

const ImageBack = require('../images/hanspi-back.png')
const ImageFront = require('../images/hanspi-front.png')

const styles = StyleSheet.create({
  hotspotsContainer: {
    position: 'relative',
    zIndex: 123,
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
    width: ' 100%',
    minHeight: 55,
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

  const animatedOpacityValue = useRef<AnimatedValue>(new Animated.Value(0))
    .current

  const animatedHotspotValue = useRef<AnimatedValue>(new Animated.Value(0))
    .current

  useEffect(() => {
    if (state.term) {
      animateHotspots()
    }
  }, [state.term])

  const hotspotRadius = state.imageHeight > 700 ? 10 : 6

  const animateHotspots = () => {
    animatedHotspotValue.setValue(0)
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedHotspotValue, {
          duration: 800,
          easing: Easing.linear,
          toValue: 0,
        }),
        Animated.timing(animatedHotspotValue, {
          duration: 800,
          easing: Easing.linear,
          toValue: 1,
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

    return (
      <View
        key={hotspot.term}
        style={{
          left,
          opacity: 0.6,
          position: 'absolute',
          top,
          zIndex: 2,
        }}
      >
        <TouchableOpacity
          hitSlop={{ top: 12, left: 12, bottom: 12, right: 12 }}
          onPress={() => {
            show(hotspot.term)
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
    }).start(callback)
  }

  const fadeInNewTerm = () => {
    animatedOpacityValue.setValue(0)
    Animated.timing(animatedOpacityValue, {
      duration: 300,
      easing: Easing.linear,
      toValue: 1,
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
    .map(hotspot => renderHotspot(hotspot))

  const onImageContainerLayout = event => {
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

  return (
    <SafeAreaView style={styles.container}>
      {renderTechniqueLabels()}
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

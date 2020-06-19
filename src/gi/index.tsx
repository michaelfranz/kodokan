import React, { useState } from 'react'
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Easing,
  TouchableOpacity,
} from 'react-native'
import GiInfo, { baseImageDimensions } from '../data/GiInfo'
import withScreenLayout from '../common/withScreenLayout'
import Hotspot from '../data/Hotspot'
import Animated from 'react-native-reanimated'
import ArticleInfo from '../data/ArticleInfo'
import { SafeAreaView } from 'react-navigation'
import { PRIMARY_COLOUR } from '../theme/colours'
import { Text, H3, H2 } from '../common/text'

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

  const animatedHotspotValue = new Animated.Value(0)
  const animatedOpacityValue = new Animated.Value(0)

  const hotspotRadius = state.imageHeight > 700 ? 10 : 6

  const imageMargin = (sx: number) => {
    // Distance between left border and image
    const dimensions = Dimensions.get('window')
    const windowWidth = dimensions.width
    return Math.max(windowWidth - baseImageDimensions.width * sx, 0) / 2
  }

  const renderHotspot = (hotspot: Hotspot) => {
    const { imageHeight, imageWidth } = state
    const highlighted = false

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

    // The following component hierarchy may seem over-complicated. However it is a work-around for what appears to
    // be a bug: That child elements of TouchableOpacity to not respond correctly on iOS hardware if said child has
    // absolute positioning. Placing the absolute positioning in an enclosing parent view overcomes the problem.
    // See: https://github.com/facebook/react-native/issues/13845
    // At the time of writing this problem is manifest on RN 0.51
    return (
      <View
        key={hotspot.term}
        style={{
          left,
          opacity: 10,
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
          <View
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
      duration: state.term ? 500 : 0, // no delay if current term undefined
      easing: Easing.linear,
      toValue: 0,
    }).start(callback)
  }

  const fadeInNewTerm = () => {
    animatedOpacityValue.setValue(0)
    Animated.timing(animatedOpacityValue, {
      duration: 500,
      easing: Easing.linear,
      toValue: 1,
    }).start()
  }

  const show = (term: string) => {
    if (term === state.term) {
      return
    }
    if (giInfo.isGiTerm(term)) {
      setState({
        ...state,
        term,
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
    return (
      <View style={[styles.techniqueContainer]}>
        <H2 style={styles.techniqueContainerText}>{term}</H2>
        {article && (
          <H3 style={styles.techniqueContainerText}>{article.translation}</H3>
        )}
      </View>
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

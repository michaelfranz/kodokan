import * as React from 'react'
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'

import PurchaseManager, { VIDEO_PRODUCT } from '../purchase/PurchaseManager'

import Video from 'react-native-video'
import { BACKGROUND_COLOUR } from '../theme/colours'
import withScreenLayout, { Props } from '../common/withScreenLayout'

const styles = StyleSheet.create({
  controlButton: {
    backgroundColor: 'transparent',
    borderRadius: 4,
    color: 'rgba(255,255,255,0.5)',
    fontSize: 20,
    padding: 20,
  },
  controlPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'flex-start',
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  fullScreen: {
    flex: 1,
    width: '100%',
    position: 'relative',
    flexDirection: 'column',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    alignSelf: 'center',
    backgroundColor: 'transparent',
    width: '100%',
  },
})

interface IState {
  paused: boolean
  videoURI: any
  controlsDisabled: boolean
}

class VideoScreen extends React.Component<Props, IState> {
  // noinspection JSUnusedGlobalSymbols
  public static navigationOptions = {
    header: null,
  }

  // @ts-ignore
  private ga = (this.ga = null)

  /// @ts-ignore
  private purchaseManager: PurchaseManager

  private player: any

  public constructor(props) {
    super(props)
    this.state = {
      paused: false,
      videoURI: undefined,
      controlsDisabled: false,
    }
    this.purchaseManager = new PurchaseManager(VIDEO_PRODUCT)
  }

  public componentDidMount() {
    const { state } = this.props.navigation
    const { params } = state
    this.setStateFromParams(params)
  }

  public render() {
    const { paused, videoURI } = this.state
    if (!videoURI) {
      return null
    }
    return (
      <View style={styles.fullScreen}>
        <StatusBar hidden={true} />
        <Video
          onEnd={this.onEnd}
          fullscreen={true}
          paused={paused}
          resizeMode="contain"
          source={{ uri: videoURI }}
          style={[styles.video, { aspectRatio: 1 }]}
          ref={ref => {
            this.player = ref
          }}
        />
        <View style={styles.controlPanel}>
          <TouchableOpacity
            style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
            onPress={() => this.pauseVideo()}
          >
            <Text style={styles.controlButton}>
              <Icon
                name={paused ? 'play' : 'pause'}
                size={20}
                color={BACKGROUND_COLOUR}
              />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
            onPress={() => this.stopVideo()}
          >
            <Text style={styles.controlButton}>
              <Icon name="stop" size={20} color={BACKGROUND_COLOUR} />
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  private pauseVideo = () => {
    if (this.state.controlsDisabled) {
      return
    }
    this.setState(prevState => {
      return { paused: !prevState.paused, controlsDisabled: false }
    })
  }

  private callOnGoBackIfExists = () => {
    const { params = {} } = this.props.navigation.state
    if (params.onGoBack) {
      params.onGoBack()
    }
  }

  private stopVideo = () => {
    if (this.state.controlsDisabled) {
      return
    }
    this.setState(
      {
        controlsDisabled: true, // this is to prevent onEnd callback being called multiple times
      },
      () => {
        this.props.navigation.goBack(null)
        this.callOnGoBackIfExists()
      }
    )
  }

  private setStateFromParams(params) {
    const videoURI = params.uri
    this.setState({
      videoURI,
    })
  }

  private onEnd = () => {
    const { navigation } = this.props
    navigation.goBack(null)
    this.callOnGoBackIfExists()
  }
}

export default withScreenLayout(VideoScreen, true)

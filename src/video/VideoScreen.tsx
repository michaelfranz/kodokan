import * as React from 'react'
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'

import * as DeviceInfo from 'react-native-device-info'
import { Analytics, Hits as GAHits } from 'react-native-google-analytics'

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
  },
  fullScreen: {
    flex: 1,
    width: '100%',
    position: 'relative',
    flexDirection: 'column',
    backgroundColor: 'red',
  },
  video: {
    alignSelf: 'center',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
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
    this.initGA()
  }

  public initGA() {
    const clientId = DeviceInfo.getUniqueId()
    this.ga = new Analytics(
      'UA-113168294-1',
      clientId,
      1,
      DeviceInfo.getUserAgent()
    )
    const screenView = new GAHits.ScreenView(
      'KodokanPro',
      this.constructor.name,
      DeviceInfo.getReadableVersion(),
      DeviceInfo.getBundleId()
    )
    this.ga.send(screenView)
  }

  public render() {
    const { paused, videoURI } = this.state
    if (!videoURI) {
      return null
    }

    const isLandscape = this.props.orientation === 'landscape'
    return (
      <View style={styles.fullScreen}>
        <StatusBar hidden={true} />
        <Video
          onEnd={this.onEnd}
          fullscreen={true}
          paused={paused}
          resizeMode={isLandscape ? 'stretch' : 'content'}
          source={{ uri: videoURI }}
          style={styles.video}
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
    this.props.navigation.goBack(null)
  }
}

export default withScreenLayout(VideoScreen, true)

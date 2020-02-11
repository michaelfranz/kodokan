import * as React from 'react'
import {StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native'

import FontAwesome, {Icons} from 'react-native-fontawesome'

import * as DeviceInfo from 'react-native-device-info'
import {Analytics, Hits as GAHits} from 'react-native-google-analytics'

import PurchaseManager, {VIDEO_PRODUCT} from '../purchase/PurchaseManager'

import Video from 'react-native-video'

import Orientation from 'react-native-orientation'

const styles = StyleSheet.create({
    controlButton: {
        backgroundColor: 'transparent',
        borderRadius: 4,
        color: 'rgba(255,255,255,0.5)',
        fontSize: 20,
        padding: 20,
    },
    controlPanel: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    fullScreen: {
        alignItems: 'flex-start',
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    video: {
        alignSelf: 'stretch',
        backgroundColor: 'black',
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    },
})

interface IProps {
    navigation: any
}

interface IState {
    paused: boolean
    resizeMode: string
    seekTime: number
    videoURI: any
}

let ga = (this.ga = null)

export default class VideoScreen extends React.Component<IProps, IState> {
    // noinspection JSUnusedGlobalSymbols
    public static navigationOptions = {
        header: null,
    }

    private purchaseManager: PurchaseManager

    public constructor(props) {
        super(props)
        this.state = {
            paused: false,
            resizeMode: 'cover',
            seekTime: 0,
            videoURI: undefined,
        }
        this.purchaseManager = new PurchaseManager(VIDEO_PRODUCT)
    }

    public componentWillMount() {
        const clientId = DeviceInfo.getUniqueID()
        ga = new Analytics('UA-113168294-1', clientId, 1, DeviceInfo.getUserAgent())
        const screenView = new GAHits.ScreenView(
            'KodokanPro',
            this.constructor.name,
            DeviceInfo.getReadableVersion(),
            DeviceInfo.getBundleId()
        )
        ga.send(screenView)
    }

    public componentDidMount() {
        const {state} = this.props.navigation
        const {params} = state
        this.setStateFromParams(params)
    }

    public componentWillReceiveProps(nextProps) {
        const {state} = nextProps.navigation
        const {params} = state
        this.setStateFromParams(params)
    }

    public render() {
        const {paused, seekTime, resizeMode, videoURI} = this.state
        if (!videoURI) {
            return null
        }
        return (
            <View style={styles.fullScreen} onLayout={this.onLayout}>
                <StatusBar hidden={true} />
                <Video
                    onEnd={this.onEnd}
                    fullscreen={false}
                    paused={paused}
                    resizeMode={resizeMode}
                    seek={seekTime}
                    source={{uri: videoURI}}
                    style={styles.video}
                />
                <View style={styles.controlPanel}>
                    <TouchableOpacity
                        style={{backgroundColor: 'rgba(255,255,255,0.07)'}}
                        onPress={() => this.pauseVideo()}
                    >
                        <Text style={styles.controlButton}>
                            <FontAwesome>{paused ? Icons.play : Icons.pause}</FontAwesome>
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{backgroundColor: 'rgba(255,255,255,0.07)'}}
                        onPress={() => this.stopVideo()}
                    >
                        <Text style={styles.controlButton}>
                            <FontAwesome>{Icons.stop}</FontAwesome>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    private onLayout = event => {
        const {width, height} = event.nativeEvent.layout
        const resizeMode = width > height ? 'stretch' : 'cover'
        this.setState({
            resizeMode,
        })
    }

    private pauseVideo = () => {
        this.setState(prevState => {
            return {paused: !prevState.paused}
        })
    }

    private stopVideo = () => {
        if (this.state.paused) {
            // Video needs to be un-paused in order for "stop" to work by setting the seek time
            this.setState({paused: false}, () => {
                // Now set seek time to beyond the end of the video
                this.setState({seekTime: 99999})
            })
        } else {
            this.setState({seekTime: 99999})
        }
    }

    private setStateFromParams(params) {
        Orientation.lockToLandscape()
        const videoURI = params.uri
        this.setState({
            videoURI,
        })
    }

    private onEnd = () => {
        Orientation.unlockAllOrientations()
        this.props.navigation.goBack(null)
    }
}

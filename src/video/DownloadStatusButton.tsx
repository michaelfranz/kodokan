import * as React from 'react'
import {Alert, Text, TouchableOpacity, View} from 'react-native'
import FontAwesome, {Icons} from 'react-native-fontawesome'
import * as Progress from 'react-native-progress'
import Video from '../data/Video'
import {strings} from '../locales/i18n'

interface IProps {
    isOnline: boolean
    video: Video
}

interface IState {
    downloadProgress?: (bytesWritten: number, contentLength: number) => void
    fileSize: number
    isDownloaded: boolean
}

export default class DownloadStatusButton extends React.Component<IProps, IState> {
    public constructor(props) {
        super(props)
        this.state = {
            downloadProgress: undefined,
            fileSize: 0,
            isDownloaded: false,
        }
    }

    public componentDidMount() {
        this.setStatusForProps(this.props)
    }

    public componentWillReceiveProps(nextProps) {
        this.setStatusForProps(nextProps)
    }

    public render() {
        return (
            <View
                style={{
                    alignItems: 'center',
                    backgroundColor: 'rgba(255,255,255,0.5)',
                    borderColor: 'darkgrey',
                    borderRadius: 6,
                    borderWidth: 1,
                    marginRight: 4,
                    paddingBottom: 2,
                    paddingTop: 2,
                    width: 32,
                }}
            >
                {this.renderProgressOrDownloadButton()}
                {this.renderSizeElement()}
            </View>
        )
    }

    private setStatusForProps(props) {
        const {video} = props
        video.isDownloaded().then(isDownloaded => {
            this.setState({
                fileSize: video.size,
                isDownloaded,
            })
        })
    }

    private renderProgressOrDownloadButton() {
        const {downloadProgress} = this.state
        if (downloadProgress) {
            return this.renderProgressElement()
        } else {
            return this.renderButtonElement()
        }
    }

    private renderButtonElement() {
        if (this.state.isDownloaded) {
            return this.renderDownloadedElement()
        } else if (this.props.isOnline) {
            return this.renderOnlineNotDownloadedElement()
        } else {
            return this.renderOfflineNotDownloadedElement()
        }
    }

    private renderDownloadedElement() {
        return (
            <TouchableOpacity
                style={{alignItems: 'center'}}
                hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
                onPress={this.toggleDownloadStatus}
            >
                <Text style={{color: 'darkgrey', fontSize: 15, textAlign: 'center'}}>
                    <FontAwesome>{Icons.check}</FontAwesome>
                </Text>
            </TouchableOpacity>
        )
    }

    private renderOnlineNotDownloadedElement() {
        return (
            <TouchableOpacity
                style={{alignItems: 'center'}}
                hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
                onPress={this.toggleDownloadStatus}
            >
                <Text style={{color: 'darkgrey', fontSize: 15, textAlign: 'center'}}>
                    <FontAwesome>{Icons.cloudDownload}</FontAwesome>
                </Text>
            </TouchableOpacity>
        )
    }

    private renderOfflineNotDownloadedElement() {
        return (
            <View style={{alignItems: 'center'}}>
                <Text style={{color: 'darkgrey', fontSize: 15, textAlign: 'center'}}>
                    <FontAwesome>{Icons.exclamationTriangle}</FontAwesome>
                </Text>
            </View>
        )
    }

    private renderSizeElement() {
        const {fileSize} = this.state
        return <Text style={{fontSize: 7, textAlign: 'center'}}>{(fileSize / 1048576).toFixed(1)}MB</Text>
    }

    private renderProgressElement() {
        const {video} = this.props
        const {fileSize} = this.state
        return <Progress.Pie color={'rgba(122, 122, 122, 1)'} progress={fileSize / video.size} size={18} />
    }

    private toggleDownloadStatus = () => {
        if (this.state.isDownloaded) {
            this.handleRemoveVideo()
        } else {
            this.handleDownloadVideo()
        }
    }

    private handleRemoveVideo() {
        Alert.alert(strings('RemoveVideoTitle'), strings('RemoveVideoMessage'), [
            {text: strings('RemoveVideoOK'), onPress: () => this.removeVideo()},
            {text: strings('RemoveVideoCancel')},
        ])
    }

    private removeVideo() {
        const {video} = this.props
        video
            .removeDownload()
            .then(() => {
                this.updateDownloadState()
            })
            .catch(reason => {
                console.warn(reason)
                this.updateDownloadState()
            })
    }

    private handleDownloadVideo() {
        this.setState(
            {
                fileSize: 0,
            },
            () => {
                const {video} = this.props
                const progressCallback = (bytesDownloaded: number, fileSize: number) => {
                    this.setState(
                        {
                            fileSize: bytesDownloaded,
                        },
                        () => {
                            video.isDownloaded().then(result => {
                                this.setState({
                                    downloadProgress: result ? undefined : this.state.downloadProgress,
                                    isDownloaded: result,
                                })
                            })
                        }
                    )
                }
                this.setState(
                    {
                        downloadProgress: progressCallback,
                    },
                    () => {
                        video
                            .download(progressCallback)
                            .then(result => {
                                this.setState({
                                    isDownloaded: result,
                                })
                            })
                            .catch(reason => {
                                console.warn(reason)
                                this.setState({
                                    isDownloaded: false,
                                })
                            })
                    }
                )
            }
        )
    }

    private updateDownloadState() {
        const {video} = this.props
        video.isDownloaded().then(result => {
            this.setState({
                downloadProgress: undefined,
                isDownloaded: result,
            })
        })
    }
}

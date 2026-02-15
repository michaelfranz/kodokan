import React, { useState, useEffect } from 'react'
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native'
import { Text } from '../common/text'
import Video from '../data/Video'
import {
  FOREGROUND_COLOUR,
  FOREGROUND_COLOUR_ALT,
  BACKGROUND_COLOUR,
} from '../theme/colours'
import { strings } from '../locales/i18n'
import Ionicons from 'react-native-vector-icons/Ionicons'
import ProgressCircle from 'react-native-progress-circle'
import { INFO_COLOUR } from '../theme/colours'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 2,
    width: 32,
  },
  fileSize: {
    fontSize: 8,
    color: FOREGROUND_COLOUR,
  },
})

interface IProps {
  video: Video | undefined
  isOnline: boolean | null
  onDownloadComplete: () => void
  disabled?: boolean
}

interface IState {
  downloadedSize?: number
  isDownloaded: boolean
  isDownloading: boolean
}

const DownloadStatusButton: React.FunctionComponent<IProps> = ({
  video,
  isOnline,
  onDownloadComplete,
  disabled,
}): React.ReactElement => {
  const [state, setState] = useState<IState>({
    downloadedSize: 0,
    isDownloaded: false,
    isDownloading: false,
  })

  const [isMounted, setIsMounted] = useState<boolean>(true)

  if (!video) {
    return <View />
  }

  useEffect(() => {
    setStateFromProps()

    return () => {
      setIsMounted(false)
    }
  }, [])

  useEffect(() => {
    if (state.isDownloading && !isOnline) {
      Alert.alert(
        'Download cancelled',
        strings('OfflineMessage'),
        [{ text: 'OK', onPress: () => {} }],
        { cancelable: false }
      )
      setState({
        ...state,
        downloadedSize: 0,
        isDownloading: false,
      })
    }
  }, [isOnline])

  const setStateFromProps = () => {
    if (!video) {
      return
    }
    video.isDownloaded().then(isDownloaded => {
      setState({
        isDownloading: false,
        downloadedSize: isDownloaded ? video.size : state.downloadedSize,
        isDownloaded,
      })
    })
  }

  const onDownloadButtonPress = () => {
    if (state.isDownloaded) {
      handleRemoveVideo()
    } else if (isOnline) {
      handleDownloadVideo()
    } else {
      alert('offline')
    }
  }

  const handleRemoveVideo = () => {
    Alert.alert(strings('RemoveVideoTitle'), strings('RemoveVideoMessage'), [
      { text: strings('RemoveVideoOK'), onPress: () => removeVideo() },
      { text: strings('RemoveVideoCancel') },
    ])
  }

  const removeVideo = () => {
    video
      .removeDownload()
      .then(() => {
        setState({
          ...state,
          isDownloaded: false,
          downloadedSize: 0,
        })
      })
      .catch(reason => {
        console.warn(reason)
      })
  }

  const handleDownloadVideo = () => {
    const startCallback = () => {
      setState({
        ...state,
        downloadedSize: 0,
        isDownloading: true,
      })
    }
    const progressCallback = (bytesDownloaded: number) => {
      if (!isMounted) {
        return
      }
      const isDownloading = bytesDownloaded < video.size
      setState({
        ...state,
        isDownloading,
        downloadedSize: bytesDownloaded,
      })
    }
    video
      .download({
        startCallback,
        progressCallback,
      })
      .then(result => {
        if (!isMounted) {
          return
        }
        setState({
          ...state,
          downloadedSize: result ? video.size : state.downloadedSize,
          isDownloaded: result,
          isDownloading: false,
        })

        if (onDownloadComplete) {
          onDownloadComplete()
        }
      })
      .catch(reason => {
        console.warn(reason)
        if (!isMounted) {
          return
        }
        setState({
          ...state,
          isDownloaded: false,
        })
      })
  }

  const renderProgressOrDownloadButton = () => {
    const { isDownloading } = state
    if (isDownloading) {
      return renderProgressElement()
    } else {
      return (
        <TouchableOpacity
          style={{ alignItems: 'center' }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={onDownloadButtonPress}
          disabled={disabled}
        >
          {renderButtonElement()}
        </TouchableOpacity>
      )
    }
  }

  const downloadedPercentage = (): number => {
    const { downloadedSize = 0 } = state
    return (downloadedSize / video.size) * 100
  }

  const renderProgressElement = () => {
    return (
      <ProgressCircle
        percent={downloadedPercentage()}
        radius={14}
        borderWidth={2}
        color={INFO_COLOUR}
        shadowColor={BACKGROUND_COLOUR}
        bgColor={BACKGROUND_COLOUR}
      ></ProgressCircle>
    )
  }

  const renderButtonElement = () => {
    if (state.isDownloaded) {
      return renderDownloadedElement()
    } else if (isOnline) {
      return renderOnlineNotDownloadedElement()
    } else {
      return renderOfflineNotDownloadedElement()
    }
  }

  const renderDownloadedElement = () => {
    return (
      <Ionicons
        name="checkmark-circle"
        size={24}
        color={FOREGROUND_COLOUR_ALT}
      />
    )
  }

  const renderOnlineNotDownloadedElement = () => {
    return (
      <Ionicons
        name="cloud-download"
        size={24}
        color={FOREGROUND_COLOUR_ALT}
      />
    )
  }

  const renderOfflineNotDownloadedElement = () => {
    return (
      <Ionicons name="warning" size={24} color={FOREGROUND_COLOUR_ALT} />
    )
  }

  const renderDownloadedPercentage = () => {
    return (
      <Text style={styles.fileSize}>{downloadedPercentage().toFixed()}%</Text>
    )
  }

  const renderFileSize = () => {
    const { size } = video
    return <Text style={styles.fileSize}>{(size / 1048576).toFixed(1)}MB</Text>
  }

  if (isOnline === null) {
    return <View />
  }

  return (
    <View style={styles.container}>
      {renderProgressOrDownloadButton()}
      {state.isDownloading ? renderDownloadedPercentage() : renderFileSize()}
    </View>
  )
}

export default DownloadStatusButton

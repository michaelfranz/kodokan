import React, { useState, useEffect } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Text } from '../common/text'
import Video from '../data/Video'
import { FOREGROUND_COLOUR, FOREGROUND_COLOUR_ALT } from '../theme/colours'
import Ionicons from 'react-native-vector-icons/Ionicons'

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
  isOnline: boolean
}

interface IState {
  downloadProgress?: (bytesWritten: number, contentLength: number) => void
  fileSize: number
  isDownloaded: boolean
}

const DownloadStatusButton: React.FunctionComponent<IProps> = ({
  video,
  isOnline,
}): React.ReactElement => {
  const [state, setState] = useState<IState>({
    downloadProgress: undefined,
    fileSize: 0,
    isDownloaded: false,
  })

  if (!video) {
    return <View />
  }

  useEffect(() => {
    setStateFromProps()
  }, [])

  const setStateFromProps = () => {
    if (!video) {
      return
    }
    video.isDownloaded().then(isDownloaded => {
      setState({
        fileSize: video.size,
        isDownloaded,
      })
    })
  }

  const onDownloadButtonPress = () => {
    alert('no action yet')
  }

  const renderProgressOrDownloadButton = () => {
    const { downloadProgress } = state
    if (downloadProgress) {
      return renderProgressElement()
    } else {
      return (
        <TouchableOpacity
          style={{ alignItems: 'center' }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={onDownloadButtonPress}
        >
          {renderButtonElement()}
        </TouchableOpacity>
      )
    }
  }

  const renderProgressElement = () => {
    return null
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
        name="md-checkmark-circle"
        size={20}
        color={FOREGROUND_COLOUR_ALT}
      />
    )
  }

  const renderOnlineNotDownloadedElement = () => {
    return (
      <Ionicons
        name="ios-cloud-download"
        size={20}
        color={FOREGROUND_COLOUR_ALT}
      />
    )
  }

  const renderOfflineNotDownloadedElement = () => {
    return (
      <Ionicons name="ios-warning" size={20} color={FOREGROUND_COLOUR_ALT} />
    )
  }

  const renderFileSize = () => {
    const { fileSize } = state
    return (
      <Text style={styles.fileSize}>{(fileSize / 1048576).toFixed(1)}MB</Text>
    )
  }

  return (
    <View style={styles.container}>
      {renderProgressOrDownloadButton()}
      {renderFileSize()}
    </View>
  )
}

export default DownloadStatusButton

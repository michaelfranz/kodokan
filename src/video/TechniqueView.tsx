import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native'
import { videoMap } from '../data/VideoInfo'
import { H3, Text } from '../common/text'
import { strings } from '../locales/i18n'
import DownloadStatusButton from './DownloadStatusButton'

const styles = StyleSheet.create({
  techniqueContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'rgb(199,200,204)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  thumbnailContainer: {
    paddingRight: 5,
  },
  thumbnailImage: {
    height: 40,
    width: 60,
  },
})

export interface IProps {
  techniqueName: string
  displayName: string
  isSelected: boolean
  onPress: () => void
  translation: string
  isOnline: boolean | null
}

interface IState {
  downloadProgress?: (bytesWritten: number, contentLength: number) => void
  fileSize: number
  isDownloaded: boolean
  isMounted: boolean
}

const TechniqueView: React.FunctionComponent<IProps> = (
  props
): React.ReactElement => {
  const [state, setState] = useState<IState>({
    downloadProgress: undefined,
    fileSize: 0,
    isDownloaded: false,
    isMounted: true,
  })

  const { techniqueName, translation, onPress, isSelected, isOnline } = props
  const { isDownloaded } = state

  useEffect(() => {
    setStateFromProps()
  }, [])

  const setStateFromProps = () => {
    const video = videoMap.get(props.techniqueName)
    if (!video) {
      return
    }
    video.isDownloaded().then(isDownloaded => {
      setState({
        ...state,
        fileSize: video.size,
        isDownloaded,
      })
    })
  }

  const noNetworkAction = () => {
    Alert.alert(strings('OfflineTitle'), strings('OfflineMessage'), [
      { text: strings('OfflineContinue') },
    ])
  }

  const renderThumbnail = techniqueName => {
    const video = videoMap.get(techniqueName)
    if (!video) {
      return null // should render placeholder image
    }
    const path = video.thumbnail as any
    return <Image source={path} style={styles.thumbnailImage} />
  }

  let onPressAction = onPress
  if (!isDownloaded && !isOnline) {
    onPressAction = noNetworkAction
  }
  return (
    <TouchableOpacity
      style={[
        styles.techniqueContainer,
        isSelected ? { backgroundColor: 'rgba(255,0,0,0.3)' } : {},
      ]}
      onPress={onPressAction}
    >
      <View style={[styles.thumbnailContainer, { width: 62 }]}>
        {renderThumbnail(techniqueName)}
      </View>
      <View
        style={{
          flex: 6,
        }}
      >
        <H3 numberOfLines={1}>{techniqueName}</H3>
        <Text numberOfLines={1}>{translation}</Text>
      </View>
      <View
        style={{
          alignItems: 'center',
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}
      >
        <DownloadStatusButton
          isOnline={isOnline}
          video={videoMap.get(techniqueName)}
          onDownloadComplete={() =>
            setState({
              ...state,
              isDownloaded: true,
            })
          }
        />
      </View>
    </TouchableOpacity>
  )
}

export default TechniqueView

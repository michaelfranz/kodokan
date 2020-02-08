import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { videoMap } from '../data/VideoInfo'
import { H3, Text } from '../common/text'
import { strings } from '../locales/i18n'

export interface IProps {
  techniqueName: string
  displayName: string
  isSelected: boolean
  onPress: () => void
  translation: string
}

const styles = StyleSheet.create({
  techniqueContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'rgb(199,200,204)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 41,
    justifyContent: 'flex-start',
  },
  thumbnailContainer: {
    paddingLeft: 1,
  },
  thumbnailImage: {
    height: 40,
    width: 60,
  },
})

interface IState {
  downloadProgress?: (bytesWritten: number, contentLength: number) => void
  fileSize: number
  isDownloaded: boolean
  isOnline: boolean
}

const TechniqueView: React.FunctionComponent<IProps> = (
  props
): React.ReactElement => {
  const [state, setState] = useState<IState>({
    downloadProgress: undefined,
    fileSize: 0,
    isDownloaded: false,
    isOnline: true,
  })

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
    return null
  }

  const { techniqueName, translation, onPress, isSelected } = props
  const { isDownloaded, isOnline } = state
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
      <View style={{ backgroundColor: 'transparent', flex: 4 }}>
        <H3>{techniqueName}</H3>
        <Text>{translation}</Text>
      </View>
      <View
        style={{
          alignItems: 'center',
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}
      ></View>
    </TouchableOpacity>
  )
}

export default TechniqueView

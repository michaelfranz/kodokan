import React, { useEffect, useState } from 'react'
import { View, ImageBackground, StyleSheet } from 'react-native'
import {
  AUDIO_PRODUCT,
  default as PurchaseManager,
  VIDEO_PRODUCT,
} from '../purchase/PurchaseManager'
import withScreenLayout from '../common/withScreenLayout'
import { H1, H3, Text, HyperLink } from '../common/text'
import { strings } from '../locales/i18n'
import { Props } from '../common/withScreenLayout'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 20,
  },
  backgroundImageContainer: {
    backgroundColor: '#d4d4d4',
    flex: 2,
  },
  backgroundImage: {
    alignContent: 'center',
    opacity: 0.5,
    resizeMode: 'contain',
  },
})

const Caio = require('../images/caio.png')

const AboutScreen = ({ orientation }): React.ReactElement<Props> => {
  const [purchaseStatusAudio, setPurchaseStatusAudio] = useState(false)
  const [purchaseStatusVideo, setPurchaseStatusVideo] = useState(false)
  const audioPurchaseManager: PurchaseManager = new PurchaseManager(
    AUDIO_PRODUCT
  )
  const videoPurchaseManager: PurchaseManager = new PurchaseManager(
    VIDEO_PRODUCT
  )

  const setPurchaseState = () => {
    audioPurchaseManager.isPurchased().then(purchased => {
      setPurchaseStatusAudio(purchased)
    })
    videoPurchaseManager.isPurchased().then(purchased => {
      setPurchaseStatusVideo(purchased)
    })
  }

  useEffect(() => {
    setPurchaseState()
  }, [])

  const audioPurchaseTextKey = purchaseStatusAudio
    ? 'AboutScreen.PurchasePurchased'
    : 'AboutScreen.PurchaseEvaluating'
  const audioPurchaseComponent = (
    <Text>
      {strings('AudioProduct')}: {strings(audioPurchaseTextKey)}
    </Text>
  )

  const videoPurchaseTextKey = purchaseStatusVideo
    ? 'AboutScreen.PurchasePurchased'
    : 'AboutScreen.PurchaseEvaluating'
  const videoPurchaseComponent = (
    <Text>
      {strings('VideoProduct')}: {strings(videoPurchaseTextKey)}
    </Text>
  )

  const isLandscape = orientation === 'landscape'

  return (
    <View style={styles.container}>
      <ImageBackground
        source={Caio}
        style={styles.backgroundImageContainer}
        imageStyle={styles.backgroundImage}
      >
        <View
          style={{
            alignItems: isLandscape ? 'flex-start' : 'center',
            flex: 0.5,
          }}
        >
          <H1
            style={{
              textAlign: isLandscape ? 'left' : 'center',
              flex: 1,
              fontSize: 26,
            }}
          >
            {'KōdōkanPro'}
          </H1>
        </View>
        <View
          style={{
            flex: 3,
            flexDirection: isLandscape ? 'row' : 'column',
            width: '100%',
          }}
        >
          <View style={{ flex: 0.5 }}>
            <View style={{ flex: 3 }}>
              <H3>{strings('AboutScreen.Judoka')}</H3>
              <Text>{strings('AboutScreen.Hanspi')}</Text>
              <Text>{strings('AboutScreen.Markus')}</Text>
            </View>
            <View style={{ flex: 3 }}>
              <H3>{strings('AboutScreen.PurchaseOptions')}</H3>
              {audioPurchaseComponent}
              {videoPurchaseComponent}
            </View>
            <View style={{ flex: 4 }}>
              <H3>{strings('AboutScreen.Thanks')}</H3>
              <Text>Charly Nusbaumer, Judoclub Delémont</Text>
              <Text>Sonia Stauffer, Budoschule Baselisk</Text>
              <Text>Gregg Smith, Southam Dojo</Text>
            </View>
          </View>
          <View style={{ flex: 0.5 }}>
            <View style={{ flex: 3 }}>
              <H3>{strings('AboutScreen.OnlineHelp')}</H3>
              <HyperLink url="mailto:support@kodokanpro.com">
                <Text>support@kodokanpro.com</Text>
              </HyperLink>
              <HyperLink url="https://twitter.com/kodokanpro">
                <Text>twitter.com/kodokanpro</Text>
              </HyperLink>
            </View>
            <View style={{ flex: 2 }}>
              <H3>{strings('AboutScreen.TechnicalAssistance')}</H3>
              <HyperLink url="http://rnfdigital.com/">
                RNF Digital Innovation
              </HyperLink>
            </View>
            <View style={{ flex: 4 }}>
              <H3>{strings('AboutScreen.Disclaimer')}</H3>
              <Text>
                {strings('AboutScreen.Disclaimer1')}
                <HyperLink url="http://kodokanjudoinstitute.org">
                  {'kodokan.org'}
                </HyperLink>
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}

export default withScreenLayout(AboutScreen, true)

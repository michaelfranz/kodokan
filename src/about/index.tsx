import React from 'react'
import { View, ImageBackground, StyleSheet, SafeAreaView } from 'react-native'
import withScreenLayout, { Props } from '../common/withScreenLayout'
import { H1, H3, Text, HyperLink } from '../common/text'
import { strings } from '../locales/i18n'
const styles = StyleSheet.create({
  backgroundImageContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
  },
  container: {
    flex: 2,
    paddingTop: 20,
  },
  backgroundImage: {
    alignContent: 'center',
    opacity: 0.5,
    resizeMode: 'contain',
  },
})

const Caio = require('../images/caio.png')

const AboutScreen = ({ orientation }): React.ReactElement<Props> => {
  const isLandscape = orientation === 'landscape'

  return (
    <ImageBackground
      source={Caio}
      style={styles.backgroundImageContainer}
      imageStyle={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
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
      </SafeAreaView>
    </ImageBackground>
  )
}

export default withScreenLayout(AboutScreen, true)

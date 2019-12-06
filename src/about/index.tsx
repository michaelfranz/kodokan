import React from 'react'
import { View } from 'react-native'
import withScreenLayout from '../common/withScreenLayout'
import { H1, H3, Text, HyperLink } from '../common/text'
import { strings } from '../locales/i18n'

const AboutScreen = (): React.ReactElement<{}> => {
  return (
    <View>
      <H1>{'KōdōkanPro'}</H1>
      <View>
        <H3>{strings('AboutScreen.Judoka')}</H3>
        <Text>{strings('AboutScreen.Hanspi')}</Text>
        <Text>{strings('AboutScreen.Markus')}</Text>
      </View>
      <View>
        <H3>{strings('AboutScreen.Thanks')}</H3>
        <Text>Charly Nusbaumer, Judoclub Delémont</Text>
        <Text>Sonia Stauffer, Budoschule Baselisk</Text>
        <Text>Gregg Smith, Southam Dojo</Text>
      </View>
      <View>
        <H3>{strings('AboutScreen.OnlineHelp')}</H3>
        <HyperLink url="mailto:support@kodokanpro.com">
          <Text>support@kodokanpro.com</Text>
        </HyperLink>
        <HyperLink url="https://twitter.com/kodokanpro">
          <Text>twitter.com/kodokanpro</Text>
        </HyperLink>
      </View>
      <View>
        <H3>{strings('AboutScreen.PurchaseOptions')}</H3>
        <Text>{strings('AudioProduct')}:</Text>
        <Text>{strings('VideoProduct')}:</Text>
      </View>
      <View>
        <H3>{strings('AboutScreen.TechnicalAssistance')}</H3>
        <HyperLink url="http://rnfdigital.com/">
          RNF Digital Innovation
        </HyperLink>
      </View>
      <View>
        <H3>{strings('AboutScreen.Disclaimer')}</H3>
        <Text>
          {strings('AboutScreen.Disclaimer1')}
          <HyperLink url="http://kodokanjudoinstitute.org">
            {'kodokan.org'}
          </HyperLink>
        </Text>
      </View>
    </View>
  )
}

export default withScreenLayout(AboutScreen)

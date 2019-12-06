import React, { ReactNode } from 'react'
import { Text as RNText, StyleSheet, TextStyle, Linking } from 'react-native'
import { FONT_FAMILY_SUBHEADING, FONT_FAMILY_BASE } from '../theme/type'
import { FONT_FAMILY_HEADING } from '../theme/type'
import { PRIMARY_COLOUR } from '../theme/colours'

const styles = StyleSheet.create({
  heading: {
    fontFamily: FONT_FAMILY_HEADING,
    letterSpacing: -1,
  },
  subheading: {
    fontFamily: FONT_FAMILY_SUBHEADING,
  },
  baseText: {
    fontFamily: FONT_FAMILY_BASE,
  },
  hyperlink: {
    fontFamily: FONT_FAMILY_BASE,
    color: PRIMARY_COLOUR,
  },
})

export interface Props {
  children: ReactNode;
  style?: TextStyle;
}

export const H1: React.FunctionComponent<Props> = ({ children, style }) => {
  return (
    <RNText style={[styles.heading, { fontSize: 20 }, style]}>
      {children}
    </RNText>
  )
}

export const H2: React.FunctionComponent<Props> = ({ children, style }) => {
  return (
    <RNText style={[styles.subheading, { fontSize: 18 }, style]}>
      {children}
    </RNText>
  )
}

export const H3: React.FunctionComponent<Props> = ({ children, style }) => {
  return (
    <RNText style={[styles.subheading, { fontSize: 15 }, style]}>
      {children}
    </RNText>
  )
}

export const Text: React.FunctionComponent<Props> = ({ children, style }) => {
  return (
    <RNText style={[styles.baseText, { fontSize: 12 }, style]}>
      {children}
    </RNText>
  )
}

const openURL = (url: string) => {
  Linking.canOpenURL(url).then(supported => {
    if (supported) {
      Linking.openURL(url)
    }
  })
}

export const HyperLink: React.FunctionComponent<Props & { url: string }> = ({
  children,
  style,
  url,
}) => {
  return (
    <RNText
      onPress={() => openURL(url)}
      style={[styles.hyperlink, { fontSize: 12 }, style]}
    >
      {children}
    </RNText>
  )
}

import { I18nManager } from 'react-native'
import * as RNLocalize from 'react-native-localize'
import I18n from 'i18n-js'

import de from './de.json'
import en from './en.json'
import es from './es.json'
import fr from './fr.json'
import it from './it.json'
import jp from './jp.json'

I18n.fallbacks = true

I18n.translations = {
  de,
  en,
  es,
  fr,
  it,
  jp,
}

const locales = RNLocalize.getLocales()
if (locales.length > 0) {
  I18n.locale = locales[0].languageTag
}

export const isRTL = false

I18nManager.allowRTL(isRTL)

export function strings(name: string, params = {}) {
  return I18n.t(name, params)
}

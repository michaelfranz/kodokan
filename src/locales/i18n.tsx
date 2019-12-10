import { I18nManager } from 'react-native'
import I18n from 'react-native-i18n'

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

export const isRTL = false

I18nManager.allowRTL(isRTL)

export function strings(name, params = {}) {
  return I18n.t(name, params)
}

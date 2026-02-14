import * as RNLocalize from 'react-native-localize'
import store from './store'

const SUPPORTED_LANGUAGES = ['de', 'en', 'fr', 'it', 'es', 'ja']
const DICTIONARY_LANGUAGE_KEY = 'dictionaryLanguage'
const DEFAULT_LANGUAGE = 'en'

export default class AppSettings {
  public static async dictionaryLanguage() {
    const dictionaryLanguageSetting = await AppSettings.cachedDictionaryLanguage()
    if (!dictionaryLanguageSetting || !dictionaryLanguageSetting.lang) {
      const preferredLanguage = await AppSettings.preferredSupportedLanguage()
      const languageToSave = preferredLanguage || DEFAULT_LANGUAGE
      await AppSettings.saveDictionaryLanguage(languageToSave)
      return languageToSave
    }
    return AppSettings.cachedDictionaryLanguage
  }

  private static async saveDictionaryLanguage(lang: string) {
    return await store.update(DICTIONARY_LANGUAGE_KEY, {
      lang,
    })
  }

  private static async cachedDictionaryLanguage() {
    return await store.get(DICTIONARY_LANGUAGE_KEY)
  }

  private static preferredSupportedLanguage() {
    const locales = RNLocalize.getLocales()
    const preferredLanguages = locales.map((locale) =>
      AppSettings.country(locale.languageTag)
    )
    return preferredLanguages.find(AppSettings.isSupportedLanguage) // may return *undefined*
  }

  private static isSupportedLanguage(locale: string): boolean {
    return SUPPORTED_LANGUAGES.includes(AppSettings.country(locale))
  }

  private static country(locale: string) {
    return locale.substring(0, 2)
  }
}

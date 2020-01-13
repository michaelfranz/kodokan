import {Settings} from 'react-native'
import {getLanguages} from 'react-native-i18n'

const supportedLanguages = ['de', 'en', 'fr', 'it', 'es', 'ja']

export default class AppSettings {
    public static async dictionaryLanguage() {
        if (!AppSettings.cachedDictionaryLanguage) {
            const dictionaryLanguageSetting = Settings.get('dictionaryLanguage')
            if (dictionaryLanguageSetting === undefined || 'default' === dictionaryLanguageSetting) {
                AppSettings.cachedDictionaryLanguage = (await AppSettings.preferredSupportedLanguage()) || 'en' // fallback if can't support preferred language
            } else {
                AppSettings.cachedDictionaryLanguage = dictionaryLanguageSetting
            }
        }
        return AppSettings.cachedDictionaryLanguage
    }

    private static cachedDictionaryLanguage

    private static async preferredSupportedLanguage() {
        const preferredLanguages = (await getLanguages()).map(locale => AppSettings.country(locale))
        return preferredLanguages.find(AppSettings.isSupportedLanguage) // may return *undefined*
    }

    private static isSupportedLanguage(locale: string): boolean {
        return supportedLanguages.includes(AppSettings.country(locale))
    }

    private static country(locale: string) {
        return locale.substring(0, 2)
    }
}

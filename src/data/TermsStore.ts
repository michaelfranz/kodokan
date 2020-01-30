import store from 'react-native-simple-store'

const RECENT_TERMS_STORE_KEY = 'recentTerms'
const TERM_OF_THE_DAY_KEY = 'termOfTheDay'

export default class TermsStore {
  public static async recentTerms(): Promise<string[]> {
    const recentTerms: { terms: string[] } = await store.get(
      RECENT_TERMS_STORE_KEY
    )
    return recentTerms ? recentTerms.terms : []
  }

  public static async addTermToRecent(term: string): Promise<number> {
    const recentTerms: string[] = await TermsStore.recentTerms()
    const newRecentTerms = [
      term,
      ...recentTerms.filter(recentTerm => term !== recentTerm),
    ]
    await store.update(RECENT_TERMS_STORE_KEY, {
      terms: newRecentTerms.slice(0, 10),
    })
    return newRecentTerms.length
  }

  public static async clearRecents() {
    return await store.delete(RECENT_TERMS_STORE_KEY)
  }
}

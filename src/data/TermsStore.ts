import store from 'react-native-simple-store'
import Article from './Article'
import ArticleInfo from './ArticleInfo'

const RECENT_TERMS_STORE_KEY = 'recentTerms'
const TERM_OF_THE_DAY_KEY = 'termOfTheDay'

export interface IPastTerm {
  name: string
  date: string
}

export interface ITermOfTheDayStore {
  pastTerms: IPastTerm[]
}

export interface IRecentTerms {
  terms: string[]
}

const PAST_TERMS_OF_THE_DAY_TO_SAVE = 10
const RECENT_TERMS_TO_SAVE = 10

export default class TermsStore {
  public static async pastTermsOfTheDay(): Promise<IPastTerm[]> {
    const storedData: ITermOfTheDayStore = await store.get(TERM_OF_THE_DAY_KEY)
    return storedData ? storedData.pastTerms : []
  }

  public static async termOfTheDay(): Promise<Article | undefined> {
    const pastTerms = await TermsStore.pastTermsOfTheDay()
    const today = new Date().toDateString()

    if (pastTerms.length && pastTerms[0].date === today) {
      return ArticleInfo.articleForTerm(pastTerms[0].name)
    }

    const recentTerms = await TermsStore.recentTerms()
    const termsToExclude = pastTerms.map(term => term.name)
    const articlesExcludingPastTerms = ArticleInfo.allArticlesExcept([
      ...termsToExclude,
      ...recentTerms,
    ])
    const termOfTheDay = ArticleInfo.randomArticleFromArticles(
      articlesExcludingPastTerms
    )
    await TermsStore.saveTermOfTheDayToPastTerms(termOfTheDay.name, today)
    return termOfTheDay
  }

  public static async saveTermOfTheDayToPastTerms(term: string, date: string) {
    const storedData: ITermOfTheDayStore = await store.get(TERM_OF_THE_DAY_KEY)
    const newEntry = { name: term, date }
    const newData = storedData
      ? [newEntry, ...storedData.pastTerms]
      : [newEntry]
    await store.update(TERM_OF_THE_DAY_KEY, {
      pastTerms: newData.slice(0, PAST_TERMS_OF_THE_DAY_TO_SAVE),
    })
  }

  public static async recentTerms(): Promise<string[]> {
    const recentTerms: IRecentTerms = await store.get(RECENT_TERMS_STORE_KEY)
    return recentTerms ? recentTerms.terms : []
  }

  public static async addTermToRecent(term: string): Promise<number> {
    const recentTerms: string[] = await TermsStore.recentTerms()
    const newRecentTerms = [
      term,
      ...recentTerms.filter(recentTerm => term !== recentTerm),
    ]
    await store.update(RECENT_TERMS_STORE_KEY, {
      terms: newRecentTerms.slice(0, RECENT_TERMS_TO_SAVE),
    })
    return newRecentTerms.length
  }

  public static async clearRecents() {
    return await store.delete(RECENT_TERMS_STORE_KEY)
  }
}

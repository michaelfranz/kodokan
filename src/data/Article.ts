import AppSettings from '../utils/AppSettings'
import GiInfo from './GiInfo'
import TechniqueInfo from './WazaInfo'

interface IArticleParameters {
  name: string
  search: string
  en: string
  de: string
  es: string
  fr: string
  it: string
  ja: string
  pt?: string
  synonym?: string
  hide?: boolean
}

const techniqueInfo = TechniqueInfo.getInstance()
const giInfo = GiInfo.getInstance()

export default class Article {
  public name: string
  public search: string
  public synonym?: string
  public isWazaClassification: boolean
  public isGiTerm: boolean
  public isGokyo: boolean
  public isWaza: boolean
  public kyo: string | null
  public hide?: boolean
  public displayName: string
  public translation: string

  constructor({
    name,
    search,
    en,
    de,
    es,
    fr,
    it,
    ja,
    pt,
    synonym,
    hide,
  }: IArticleParameters) {
    this.name = name
    this.search = search
    this.translation = en // so never undefined
    this.displayName =
      synonym === undefined ? name : name + ' (' + synonym + ')'
    this.synonym = synonym
    this.isWazaClassification = techniqueInfo.isClassification(name)
    this.isGiTerm = giInfo.isGiTerm(name)
    this.isGokyo = techniqueInfo.isKyoWazaTerm(name)
    this.isWaza = techniqueInfo.isWazaTerm(name)
    this.kyo = techniqueInfo.kyoForKyoWazaTerm(name) || null
    this.hide = hide
    AppSettings.dictionaryLanguage().then(language => {
      switch (language) {
        case 'de':
          this.translation = de
          break
        case 'es':
          this.translation = es
          break
        case 'fr':
          this.translation = fr
          break
        case 'it':
          this.translation = it
          break
        case 'ja':
          this.translation = ja
          break
        case 'pt':
          this.translation = pt || ''
          break
        default:
          this.translation = en
      }
    })
  }
}

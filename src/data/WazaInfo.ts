import { GO, YON, SAN, NI, IK } from '../theme/colours'

const wazaClassificationList: string[] = [
  'All',
  'Ashi-Waza',
  'Kansetsu-Waza',
  'Katame-Waza',
  'Koshi-Waza',
  'Mae-Sutemi-Waza',
  'Nage-Waza',
  'Osaekomi-Waza',
  'Shime-Waza',
  'Tachi-Waza',
  'Te-Waza',
  'Yoko-Sutemi-Waza',
  'Miscellaneous',
]

const wazaClassificationMap: Map<string, string[]> = new Map([
  [
    'Ashi-Waza',
    [
      'Ashi-Guruma',
      'De-Ashi-Barai',
      'Harai-Tsurikomi-Ashi',
      'Hiza-Guruma',
      'Ko-Soto-Gake',
      'Ko-Soto-Gari',
      'Ko-Uchi-Gari',
      'O-Guruma',
      'O-Soto-Gari',
      'O-Soto-Guruma',
      'O-Uchi-Gari',
      'Okuri-Ashi-Barai',
      'Sasae-Tsurikomi-Ashi',
      'Uchi-Mata',
    ],
  ],
  [
    'Kansetsu-Waza',
    [
      'Ude-Garami',
      'Ude-Hishigi-Ashi-Gatame',
      'Ude-Hishigi-Hara-Gatame',
      'Ude-Hishigi-Hiza-Gatame',
      'Ude-Hishigi-Jūji-Gatame',
      'Ude-Hishigi-Sankaku-Gatame',
      'Ude-Hishigi-Te-Gatame',
      'Ude-Hishigi-Ude-Gatame',
      'Ude-Hishigi-Waki-Gatame',
    ],
  ],
  [
    'Katame-Waza',
    [
      'Gyaku-Jūji-Jime',
      'Hadaka-Jime',
      'Kami-Shiho-Gatame',
      'Kata-Gatame',
      'Kata-Ha-Jime',
      'Kata-Jūji-Jime',
      'Kesa-Gatame',
      'Kuzure-Kami-Shiho-Gatame',
      'Kuzure-Kesa-Gatame',
      'Nami-Jūji-Jime',
      'Okuri-Eri-Jime',
      'Ryo-Te-Jime',
      'Sankaku-Jime',
      'Sode-Guruma-Jime',
      'Tate-Shiho-Gatame',
      'Tsukkomi-Jime',
      'Ude-Garami',
      'Ude-Hishigi-Ashi-Gatame',
      'Ude-Hishigi-Hara-Gatame',
      'Ude-Hishigi-Hiza-Gatame',
      'Ude-Hishigi-Jūji-Gatame',
      'Ude-Hishigi-Sankaku-Gatame',
      'Ude-Hishigi-Te-Gatame',
      'Ude-Hishigi-Ude-Gatame',
      'Ude-Hishigi-Waki-Gatame',
      'Yoko-Shiho-Gatame',
    ],
  ],
  [
    'Koshi-Waza',
    [
      'Hane-Goshi',
      'Harai-Goshi',
      'Koshi-Guruma',
      'O-Goshi',
      'Tsuri-Goshi',
      'Tsuri-Komi-Goshi',
      'Uki-Goshi',
      'Ushiro-Goshi',
      'Utsuri-Goshi',
    ],
  ],
  ['Mae-Sutemi-Waza', ['Tomoe-Nage', 'Ura-Nage']],
  [
    'Nage-Waza',
    [
      'Ashi-Guruma',
      'De-Ashi-Barai',
      'Hane-Goshi',
      'Hane-Makikomi',
      'Harai-Goshi',
      'Harai-Tsurikomi-Ashi',
      'Hiza-Guruma',
      'Ippon-Seoi-Nage',
      'Kata-Guruma',
      'Ko-Soto-Gake',
      'Ko-Soto-Gari',
      'Ko-Uchi-Gari',
      'Koshi-Guruma',
      'O-Goshi',
      'O-Guruma',
      'O-Soto-Gari',
      'O-Soto-Guruma',
      'O-Uchi-Gari',
      'Okuri-Ashi-Barai',
      'Sasae-Tsurikomi-Ashi',
      'Soto-Makikomi',
      'Sukui-Nage',
      'Sumi-Gaeshi',
      'Sumi-Otoshi',
      'Tai-Otoshi',
      'Tani-Otoshi',
      'Tomoe-Nage',
      'Tsuri-Goshi',
      'Tsuri-Komi-Goshi',
      'Uchi-Mata',
      'Uki-Goshi',
      'Uki-Otoshi',
      'Uki-Waza',
      'Ura-Nage',
      'Ushiro-Goshi',
      'Utsuri-Goshi',
      'Yoko-Gake',
      'Yoko-Guruma',
      'Yoko-Otoshi',
      'Yoko-Wakare',
    ],
  ],
  [
    'Osaekomi-Waza',
    [
      'Kami-Shiho-Gatame',
      'Kata-Gatame',
      'Kesa-Gatame',
      'Kuzure-Kami-Shiho-Gatame',
      'Kuzure-Kesa-Gatame',
      'Tate-Shiho-Gatame',
      'Yoko-Shiho-Gatame',
    ],
  ],
  [
    'Shime-Waza',
    [
      'Gyaku-Jūji-Jime',
      'Hadaka-Jime',
      'Kata-Ha-Jime',
      'Kata-Jūji-Jime',
      'Nami-Jūji-Jime',
      'Okuri-Eri-Jime',
      'Ryo-Te-Jime',
      'Sankaku-Jime',
      'Sode-Guruma-Jime',
      'Tsukkomi-Jime',
    ],
  ],
  [
    'Tachi-Waza',
    [
      'Ashi-Guruma',
      'De-Ashi-Barai',
      'Hane-Goshi',
      'Hane-Makikomi',
      'Harai-Goshi',
      'Harai-Tsurikomi-Ashi',
      'Hiza-Guruma',
      'Ippon-Seoi-Nage',
      'Kata-Guruma',
      'Ko-Soto-Gake',
      'Ko-Soto-Gari',
      'Ko-Uchi-Gari',
      'Koshi-Guruma',
      'O-Goshi',
      'O-Guruma',
      'O-Soto-Gari',
      'O-Soto-Guruma',
      'O-Uchi-Gari',
      'Okuri-Ashi-Barai',
      'Sasae-Tsurikomi-Ashi',
      'Soto-Makikomi',
      'Sukui-Nage',
      'Sumi-Gaeshi',
      'Sumi-Otoshi',
      'Tai-Otoshi',
      'Tani-Otoshi',
      'Tomoe-Nage',
      'Tsuri-Goshi',
      'Tsuri-Komi-Goshi',
      'Uchi-Mata',
      'Uki-Goshi',
      'Uki-Otoshi',
      'Uki-Waza',
      'Ura-Nage',
      'Ushiro-Goshi',
      'Utsuri-Goshi',
      'Yoko-Gake',
      'Yoko-Guruma',
      'Yoko-Otoshi',
      'Yoko-Wakare',
    ],
  ],
  [
    'Te-Waza',
    [
      'Ippon-Seoi-Nage',
      'Kata-Guruma',
      'Sukui-Nage',
      'Sumi-Gaeshi',
      'Sumi-Otoshi',
      'Tai-Otoshi',
      'Uki-Otoshi',
    ],
  ],
  [
    'Yoko-Sutemi-Waza',
    [
      'Hane-Makikomi',
      'Soto-Makikomi',
      'Tani-Otoshi',
      'Uki-Waza',
      'Yoko-Gake',
      'Yoko-Guruma',
      'Yoko-Otoshi',
      'Yoko-Wakare',
    ],
  ],
  ['Miscellaneous', ['Obi', 'Obi-Katame', 'Ritsurei', 'Zarei']],
])

const allKyo: string[] = ['GO', 'YON', 'SAN', 'NI', 'IK']

const kyoWazaTermsMap: Map<string, string[]> = new Map<string, string[]>([
  [
    'GO',
    [
      'De-Ashi-Barai',
      'Hiza-Guruma',
      'Sasae-Tsurikomi-Ashi',
      'Uki-Goshi',
      'O-Soto-Gari',
      'O-Goshi',
      'O-Uchi-Gari',
      'Ippon-Seoi-Nage',
    ],
  ],

  [
    'YON',
    [
      'Ko-Soto-Gari',
      'Ko-Uchi-Gari',
      'Koshi-Guruma',
      'Tsuri-Komi-Goshi',
      'Okuri-Ashi-Barai',
      'Tai-Otoshi',
      'Harai-Goshi',
      'Uchi-Mata',
    ],
  ],

  [
    'SAN',
    [
      'Ko-Soto-Gake',
      'Tsuri-Goshi',
      'Yoko-Otoshi',
      'Ashi-Guruma',
      'Hane-Goshi',
      'Harai-Tsurikomi-Ashi',
      'Tomoe-Nage',
      'Kata-Guruma',
    ],
  ],

  [
    'NI',
    [
      'Sumi-Gaeshi',
      'Tani-Otoshi',
      'Hane-Makikomi',
      'Sukui-Nage',
      'Utsuri-Goshi',
      'O-Guruma',
      'Soto-Makikomi',
      'Uki-Otoshi',
    ],
  ],

  [
    'IK',
    [
      'O-Soto-Guruma',
      'Uki-Waza',
      'Yoko-Wakare',
      'Yoko-Guruma',
      'Ushiro-Goshi',
      'Ura-Nage',
      'Sumi-Otoshi',
      'Yoko-Gake',
    ],
  ],
])

export const kyoColours: {
  GO: string
  YON: string
  SAN: string
  NI: string
  IK: string
} = {
  GO,
  YON,
  SAN,
  NI,
  IK,
}

export default class TechniqueInfo {
  public static getInstance() {
    if (!TechniqueInfo.instance) {
      TechniqueInfo.instance = new TechniqueInfo()
    }
    return TechniqueInfo.instance
  }

  private static instance: TechniqueInfo

  private wazaTerms: Set<string> = new Set()

  private constructor() {
    // Initialise all techniques ("waza")
    const classifications = wazaClassificationList.filter(
      name => name !== 'All'
    )

    classifications.forEach(classification => {
      const techniques = wazaClassificationMap.get(classification)
      if (techniques === undefined) {
        throw new Error(
          'Problem with data: techniques undefined for classification===' +
            classification
        )
      }
      techniques.forEach(technique => this.wazaTerms.add(technique))
    })
    const allTechniques = Array.from(this.wazaTerms).sort(
      (a, b) => 0 - (a < b ? 1 : -1)
    )
    wazaClassificationMap.set('All', allTechniques)

    // Initialise all kyo techniques ("gokyo")
    kyoWazaTermsMap.forEach(kyoWaza =>
      kyoWaza.forEach(name => this.kyoWazaTerms.add(name))
    )
  }

  public kyoWazaTerms: Set<string> = new Set()

  public isWazaTerm = (term: string): boolean => this.wazaTerms.has(term)

  public isClassification = (term: string): boolean =>
    wazaClassificationList.includes(term)

  public classificationForWazaTerm = (wazaTerm: string): string => {
    const allClassifications = wazaClassificationList.filter(
      classification => classification !== 'All'
    )
    return (
      allClassifications.find(classification =>
        wazaClassificationMap!.get(classification)!.includes(wazaTerm)
      ) || ''
    )
  }

  public wazaForClassificationTerm = (classificationTerm: string): string[] => {
    return wazaClassificationMap!.get(classificationTerm) || ['']
  }

  public wazaClassifications = (): string[] => wazaClassificationList

  public isKyoWazaTerm = (term: string): boolean => this.kyoWazaTerms.has(term)

  public kyoForKyoWazaTerm = (wazaTerm: string): string => {
    return (
      allKyo.find(kyo => kyoWazaTermsMap!.get(kyo)!.includes(wazaTerm)) || ''
    )
  }

  public wazaForKyo = (kyo: string): string[] => {
    return kyoWazaTermsMap!.get(kyo) || ['']
  }
}

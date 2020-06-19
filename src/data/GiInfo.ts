import Hotspot from './Hotspot'

const baseImageDimensions: any = { width: 980, height: 1674 }

const giHotspotsFront: Hotspot[] = [
  new Hotspot('Hidari-Yoko-Eri', 60, 17),
  new Hotspot('Migi-Yoko-Eri', 40, 17),
  new Hotspot('Hidari-Mae-Eri', 55, 23),
  new Hotspot('Migi-Mae-Eri', 46, 23),
  new Hotspot('Hidari-Sotonaka-Sode', 78, 37),
  new Hotspot('Migi-Sotonaka-Sode', 20, 37),
  new Hotspot('Hidari-Sodeguchi', 86, 50),
  new Hotspot('Migi-Sodeguchi', 7, 49),
  new Hotspot('Mae-Obi', 50, 46),
  new Hotspot('Hidari-Yoko-Obi', 36, 43),
  new Hotspot('Migi-Yoko-Obi', 64, 43),
  new Hotspot('Hidari-Susoguchi', 73, 90),
  new Hotspot('Migi-Susoguchi', 24, 89),
  new Hotspot('Suso', 48, 56),
]

const giHotspotsBack: Hotspot[] = [
  new Hotspot('Ushiro-Eri', 100, 61),
  new Hotspot('Ushiro-Obi', 105, 171),
]

export default class GiInfo {
  public static getInstance() {
    if (!GiInfo.instance) {
      GiInfo.instance = new GiInfo()
    }
    return GiInfo.instance
  }

  private static instance: GiInfo

  private allGiHotspotNames = new Set<string>()

  private constructor() {
    // Initialise all 'gi' hotpot names
    giHotspotsFront.forEach(hotspot => this.allGiHotspotNames.add(hotspot.term))
    giHotspotsBack.forEach(hotspot => this.allGiHotspotNames.add(hotspot.term))
  }

  public isGiTerm = (term: string) => this.allGiHotspotNames.has(term)

  public isFrontGiTerm = (term: string) =>
    giHotspotsFront.findIndex(hotspot => hotspot.term === term) > -1

  public hotspots(front: boolean = true) {
    return front ? giHotspotsFront : giHotspotsBack
  }
}

export { baseImageDimensions }

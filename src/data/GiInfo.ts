import Hotspot from './Hotspot'

const baseImageDimensions: any = {width: 240, height: 410}

const giHotspotsFront: Hotspot[] = [
    new Hotspot('Hidari-Yoko-Eri', 141, 67),
    new Hotspot('Migi-Yoko-Eri', 97, 67),
    new Hotspot('Hidari-Mae-Eri', 130, 95),
    new Hotspot('Migi-Mae-Eri', 108, 95),
    new Hotspot('Hidari-Sotonaka-Sode', 184, 145),
    new Hotspot('Migi-Sotonaka-Sode', 39, 145),
    new Hotspot('Hidari-Sodeguchi', 205, 205),
    new Hotspot('Migi-Sodeguchi', 20, 200),
    new Hotspot('Mae-Obi', 117, 190),
    new Hotspot('Hidari-Yoko-Obi', 153, 178),
    new Hotspot('Migi-Yoko-Obi', 79, 178),
    new Hotspot('Hidari-Susoguchi', 174, 374),
    new Hotspot('Migi-Susoguchi', 59, 374),
    new Hotspot('Suso', 117, 224),
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

    public isFrontGiTerm = (term: string) => giHotspotsFront.findIndex(hotspot => hotspot.term === term) > -1

    public hotspots(front: boolean = true) {
        return front ? giHotspotsFront : giHotspotsBack
    }
}

export {baseImageDimensions}

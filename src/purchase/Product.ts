// Product type designed to handle both iTunes and Google Play in-app products
interface IProduct {
  identifier: string
  price: number
  currencySymbol: string
  currencyCode: string
  priceString: string
  countryCode: string
  downloadable: boolean
  description: string
  title: string
}

export class Product {
  public identifier: string
  public price: number
  public currencySymbol: string
  public currencyCode: string
  public priceString: string
  public countryCode: string
  public downloadable: boolean
  public description: string
  public title: string

  constructor({
      identifier,
      price,
      currencySymbol,
      currencyCode,
      priceString,
      countryCode,
      downloadable,
      description,
      title,
  }: IProduct) {
      this.identifier = identifier
      this.price = price
      this.currencySymbol = currencySymbol
      this.currencyCode = currencyCode
      this.priceString = priceString
      this.countryCode = countryCode
      this.downloadable = downloadable
      this.description = description
      this.title = title
  }
}

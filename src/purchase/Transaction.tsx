// Transaction type designed to handle both iTunes and Google Play in-app Transactions
interface ITransaction {
  originalTransactionDate: number
  originalTransactionIdentifier: string
  transactionDate: number
  transactionIdentifier: string
  productIdentifier: string
  transactionReceipt: string
}

export class Transaction {
  public originalTransactionDate: number
  public originalTransactionIdentifier: string
  public transactionDate: number
  public transactionIdentifier: string
  public productIdentifier: string
  public transactionReceipt: string

  constructor({
      originalTransactionDate,
      originalTransactionIdentifier,
      transactionDate,
      transactionIdentifier,
      productIdentifier,
      transactionReceipt,
  }: ITransaction) {
      this.originalTransactionDate = originalTransactionDate
      this.originalTransactionIdentifier = originalTransactionIdentifier
      this.transactionDate = transactionDate
      this.transactionIdentifier = transactionIdentifier
      this.productIdentifier = productIdentifier
      this.transactionReceipt = transactionReceipt
  }
}

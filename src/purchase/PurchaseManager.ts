import Bluebird from "bluebird";
import { NativeModules } from "react-native";
import { Product } from "./Product";
import { Transaction } from "./Transaction";
import store from "react-native-simple-store";

const { InAppUtils } = NativeModules;

// Internal code names of the products that KodokanPro makes available
export const AUDIO_PRODUCT: string = "AudioProduct";
export const VIDEO_PRODUCT: string = "VideoProduct";
export const PLAY_EVALUATION_LIMIT = 10;
export const PLAY_EVALUATION_REMINDERS = [5, 2]; // show evaluation reminder at 5, 2 plays respectively

Bluebird.promisifyAll(InAppUtils);

export default class PurchaseManager {
  // Restores any previously purchased products. Restored products (if any) are returned as an array of Transactions.
  public static async restorePurchases(): Promise<Transaction[]> {
    const rawRestoredTransactions = await InAppUtils.restorePurchasesAsync();
    const restoredProductsTransactions: Transaction[] = [];
    for (const rawTransaction of rawRestoredTransactions) {
      const transaction = new Transaction({
        originalTransactionDate: rawTransaction.originalTransactionDate,
        originalTransactionIdentifier:
          rawTransaction.originalTransactionIdentifier,
        productIdentifier: rawTransaction.productIdentifier,
        transactionDate: rawTransaction.transactionDate,
        transactionIdentifier: rawTransaction.transactionIdentifier,
        transactionReceipt: rawTransaction.transactionReceipt
      });
      await PurchaseManager.savePurchaseTransaction(transaction);
      restoredProductsTransactions.push(transaction);
    }
    return restoredProductsTransactions;
  }

  public static productIdentifier(productName: string): string | undefined {
    return PurchaseManager.PRODUCT_ID_MAP.get(productName);
  }

  // Externally defined productName IDs as defined in iTunesConnect
  private static readonly AUDIO_PRODUCT_ID = "com.cuttingedge.kodokanpro.akiko";
  private static readonly VIDEO_PRODUCT_ID =
    "com.cuttingedge.kodokanpro.unlimited1";

  // Look-up from external to internal productName id
  private static readonly PRODUCT_MAP: Map<string, string> = new Map([
    [PurchaseManager.AUDIO_PRODUCT_ID, AUDIO_PRODUCT],
    [PurchaseManager.VIDEO_PRODUCT_ID, VIDEO_PRODUCT]
  ]);

  // Look-up from internal to external productName id
  private static readonly PRODUCT_ID_MAP: Map<string, string> = new Map([
    [AUDIO_PRODUCT, PurchaseManager.AUDIO_PRODUCT_ID],
    [VIDEO_PRODUCT, PurchaseManager.VIDEO_PRODUCT_ID]
  ]);

  private static async savePurchaseTransaction(transaction: Transaction) {
    const productName = PurchaseManager.PRODUCT_MAP.get(
      transaction.productIdentifier
    );
    if(!productName) {
      return
    }
    await store.update(
      PurchaseManager.makePurchaseKey(productName),
      transaction
    );
  }

  private static makePlayCountKey(productName: string) {
    return productName + "CountKey";
  }

  private static makePurchaseKey(productName: string) {
    return productName + "PurchaseKey";
  }

  private readonly productName: string;

  constructor(productName: string) {
    if (!PurchaseManager.productIdentifier(productName)) {
      throw new Error(
        "Assertion failure, unknown product name: " + productName
      );
    }
    this.productName = productName;
  }

  public async purchaseTransaction(): Promise<Transaction> {
    return await store.get(PurchaseManager.makePurchaseKey(this.productName));
  }

  public async isPurchased(): Promise<boolean> {
    return (await this.purchaseTransaction()) !== null;
  }

  public async loadProduct(): Promise<Product> {
    const productId = PurchaseManager.PRODUCT_ID_MAP.get(this.productName);
    const rawProductArray = await InAppUtils.loadProductsAsync([productId]);
    const rawProduct = rawProductArray[0];
    return new Product({
      countryCode: rawProduct.countryCode,
      currencyCode: rawProduct.currencyCode,
      currencySymbol: rawProduct.currencySymbol,
      description: rawProduct.description,
      downloadable: rawProduct.downloadable,
      identifier: rawProduct.identifier,
      price: rawProduct.price,
      priceString: rawProduct.priceString,
      title: rawProduct.title
    });
  }

  public async purchaseProduct(): Promise<Transaction> {
    // Must call loadProduct() prior to purchaseProduct()
    await this.loadProduct();
    const productId = PurchaseManager.PRODUCT_ID_MAP.get(this.productName);
    const rawTransaction = await InAppUtils.purchaseProductAsync(productId);
    const transaction = new Transaction({
      originalTransactionDate: rawTransaction.originalTransactionDate,
      originalTransactionIdentifier:
        rawTransaction.originalTransactionIdentifier,
      productIdentifier: rawTransaction.productIdentifier,
      transactionDate: rawTransaction.transactionDate,
      transactionIdentifier: rawTransaction.transactionIdentifier,
      transactionReceipt: rawTransaction.transactionReceipt
    });
    await PurchaseManager.savePurchaseTransaction(transaction);
    return transaction;
  }

  public async playCount(): Promise<number> {
    const result = await store.get(
      PurchaseManager.makePlayCountKey(this.productName)
    );
    return result === null ? 0 : result.count;
  }

  public async incrementPlayCount() {
    const count = await this.playCount();
    const newCount = count + 1;
    await store.update(PurchaseManager.makePlayCountKey(this.productName), {
      count: newCount
    });
    return newCount;
  }

  public async remainingPlayCount(): Promise<number> {
    const count = await this.playCount();
    return Math.max(PLAY_EVALUATION_LIMIT - count, 0);
  }

  public async expiredStatus(): Promise<boolean> {
    return (await this.remainingPlayCount()) <= 0;
  }

}

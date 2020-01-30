import { Alert } from 'react-native'
import { strings } from '../locales/i18n'
import PurchaseManager, { PLAY_EVALUATION_REMINDERS } from './PurchaseManager'
import { Transaction } from './Transaction'

export default class PurchaseHandler {
  private productName: string
  private completionCallback: (success: boolean) => void
  private purchaseManager: PurchaseManager
  private longOpRunningCallback: (longOpIsRunning: boolean) => void

  constructor(
    productName: string,
    completionCallback: (success: boolean) => void,
    longOpRunning: (longOpIsRunning: boolean) => void
  ) {
    this.productName = productName
    this.completionCallback = completionCallback
    this.purchaseManager = new PurchaseManager(productName)
    this.longOpRunningCallback = longOpRunning
  }

  public conditionalPlay() {
    this.purchaseManager.isPurchased().then(purchased => {
      if (purchased) {
        this.invokeSuccessCallback()
      } else {
        this.purchaseManager.expiredStatus().then(expired => {
          if (!expired) {
            this.showRemainingPlays()
          } else {
            this.presentEvaluationExpiredAlert()
          }
        })
      }
    })
  }

  private showRemainingPlays = () => {
    this.purchaseManager.remainingPlayCount().then(remaining => {
      if (PLAY_EVALUATION_REMINDERS.includes(remaining)) {
        this.presentRemainingPlaysAlert(remaining)
      } else {
        this.invokeSuccessCallback()
      }
    })
  }

  private presentRemainingPlaysAlert = (remaining: number) => {
    const product = strings(this.productName)
    const title = strings('EvaluationPlaysRemainingTitle', { product })
    const message = strings('EvaluationPlaysRemainingMessage', {
      remaining,
      product,
    })
    const alreadyPurchasedText = strings('EvaluationAlreadyPurchased')
    const buyNowText = strings('EvaluationPurchaseNow')
    const continueText = strings('EvaluationContinue')
    Alert.alert(
      title,
      message,
      [
        {
          text: alreadyPurchasedText,
          onPress: () => this.handleRestorePurchases(),
        },
        { text: buyNowText, onPress: () => this.handleBuyNow() },
        { text: continueText, onPress: () => this.invokeSuccessCallback() },
      ],
      { cancelable: true }
    )
  }

  private presentEvaluationExpiredAlert = () => {
    const product = strings(this.productName)
    const title = strings('EvaluationExpiredTitle', { product })
    const message = strings('EvaluationExpiredMessage', { product })
    const alreadyPurchasedText = strings('EvaluationAlreadyPurchased')
    const buyNowText = strings('EvaluationPurchaseNow')
    const continueText = strings('EvaluationContinue')
    Alert.alert(
      title,
      message,
      [
        {
          text: alreadyPurchasedText,
          onPress: () => this.handleRestorePurchases(),
        },
        { text: buyNowText, onPress: () => this.handleBuyNow() },
        { text: continueText },
      ],
      { cancelable: false }
    )
  }

  private handleRestorePurchases = () => {
    this.longOpRunningCallback(true)
    PurchaseManager.restorePurchases()
      .then(restoredTransactions => {
        const productIdentifier = PurchaseManager.productIdentifier(
          this.productName
        )
        const transaction: Transaction | undefined = restoredTransactions.find(
          trx => trx.productIdentifier === productIdentifier
        )
        if (transaction) {
          console.warn('handleRestorePurchases SUCCESS')
          this.showSuccessAlert(
            strings('EvaluationReconfirmationSucceededMessage')
          )
        } else {
          console.warn('handleRestorePurchases FAILURE')
          this.showFailureAlert(
            strings('EvaluationReconfirmationFailedMessage')
          )
        }
      })
      .catch(error => {
        console.warn('handleRestorePurchases ERROR')
        console.warn(error)
        this.showFailureAlert(strings('EvaluationReconfirmationFailedMessage'))
      })
  }

  private handleBuyNow = () => {
    this.longOpRunningCallback(true)
    // noinspection JSUnusedLocalSymbols
    this.purchaseManager
      .purchaseProduct()
      .then(() => {
        this.showSuccessAlert(strings('InAppPurchaseSucceededMessage'))
      })
      .catch(error => {
        console.warn(error)
        this.showFailureAlert(strings('InAppPurchaseFailedMessage'))
      })
  }

  private showSuccessAlert(message) {
    Alert.alert(strings(this.productName), message, [
      {
        onPress: () => {
          this.invokeSuccessCallback()
        },
        text: strings('InAppPurchaseOK'),
      },
    ])
  }

  private showFailureAlert(message) {
    Alert.alert(strings(this.productName), message, [
      {
        onPress: () => {
          this.invokeFailureCallback()
        },
        text: strings('InAppPurchaseOK'),
      },
    ])
  }

  private invokeFailureCallback() {
    this.completionCallback(false)
  }

  private invokeSuccessCallback() {
    // noinspection JSUnusedLocalSymbols
    this.purchaseManager.incrementPlayCount().then(() => {
      this.completionCallback(true)
    })
  }
}

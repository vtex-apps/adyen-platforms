import { IOClients } from '@vtex/api'

import Adyen from './adyen'
import { Onboarding } from './masterdata/onboarding'
import { Account } from './masterdata/account'
import { SellersClient } from './sellers'

export class Clients extends IOClients {
  public get adyenClient() {
    return this.getOrSet('adyenClient', Adyen)
  }

  public get sellersClient() {
    return this.getOrSet('sellersClient', SellersClient)
  }

  public get onboarding() {
    return this.getOrSet('onboarding', Onboarding)
  }

  public get account() {
    return this.getOrSet('account', Account)
  }
}

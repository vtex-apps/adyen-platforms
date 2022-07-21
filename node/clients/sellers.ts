import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

const SELLERS_URL = '/api/seller-register/pvt/sellers' as const

interface SellersResponse {
  paging: {
    from: number
    to: number
    total: number
  }
  items: Seller[]
}

interface Seller {
  id: string
  name: string
  logo: string
  isActive: boolean
  fulfillmentEndpoint: string
  allowHybridPayments: boolean
  taxCode: string
  email: string
  description: string
  sellerCommissionConfiguration: string
  catalogSystemEndpoint: string
  isBetterScope: boolean
  sellerType: number
  availableSalesChannels: SalesChannel[]
  CSCIdentification: string
  account: string
  channel: string
  salesChannel: number
  isVtex: boolean
  score: number
  exchangeReturnPolicy: string
  deliveryPolicy: string
  securityPrivacyPolicy: string
  fulfillmentSellerId: string
  trustPolicy: string
}

interface SalesChannel {
  isSelected: boolean
  id: number
  name: string
}

export class SellersClient extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        ...options?.headers,
        VtexIdClientAutCookie: context.authToken,
      },
    })
  }

  public sellers = async () => {
    return this.http.get<SellersResponse>(SELLERS_URL, {
      metric: 'adyen-getSellers',
    })
  }

  public seller = async (sellerId: string) => {
    return this.http.get<SellersResponse>(`${SELLERS_URL}/${sellerId}`, {
      metric: 'adyen-getSeller',
    })
  }
}

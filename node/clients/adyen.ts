/* eslint-disable @typescript-eslint/consistent-type-imports */
import { ExternalClient, InstanceOptions, IOContext } from '@vtex/api'

const TEST_URL = 'https://cal-test.adyen.com/cal/services' as const

export default class Adyen extends ExternalClient {
  constructor(protected context: IOContext, options?: InstanceOptions) {
    super('', context, options)
  }

  private getEndpoint(settings: any) {
    return settings.productionAPI ?? TEST_URL
  }

  public async createAccountHolder(
    accountHolder: CreateAccountHolderRequest,
    settings: any
  ): Promise<CreateAccountHolderResponse> {
    return this.http.post(
      `${this.getEndpoint(settings)}/Account/v6/createAccountHolder
      `,
      accountHolder,
      {
        headers: {
          'X-API-Key': settings.apiKey,
          'X-Vtex-Use-Https': 'true',
          'Content-Type': 'application/json',
        },
        metric: 'adyen-createAccountHolder',
      }
    )
  }

  public async closeAccountHolder(
    accountHolderCode: string,
    settings: any
  ): Promise<any> {
    return this.http.post<any>(
      `${this.getEndpoint(settings)}/Account/v6/closeAccountHolder
      `,
      { accountHolderCode },
      {
        headers: {
          'X-API-Key': settings.apiKey,
          'X-Vtex-Use-Https': 'true',
          'Content-Type': 'application/json',
        },
        metric: 'adyen-deleteAccountHolder',
      }
    )
  }

  public async getAccountHolder(
    accountHolderCode: string,
    settings: any
  ): Promise<GetAccountHolderResponse> {
    return this.http.post(
      `${this.getEndpoint(settings)}/Account/v6/getAccountHolder
      `,
      { accountHolderCode },
      {
        headers: {
          'X-API-Key': settings.apiKey,
          'X-Vtex-Use-Https': 'true',
          'Content-Type': 'application/json',
        },
        metric: 'adyen-getAccountHolder',
      }
    )
  }

  public async updateAccount({ data, settings }: any): Promise<any> {
    const { accountCode, schedule } = data

    return this.http.post(
      `${this.getEndpoint(settings)}/Account/v6/updateAccount`,
      {
        accountCode,
        payoutSchedule: {
          action: 'UPDATE',
          reason: 'Update the payout schedule',
          schedule,
        },
      },
      {
        headers: {
          'X-API-Key': settings.apiKey,
          'X-Vtex-Use-Https': 'true',
          'Content-Type': 'application/json',
        },
        metric: 'adyen-updateAccount',
      }
    )
  }

  public async getOnboardingUrl({
    data,
    settings,
  }: any): Promise<GetOnboardingUrlResponse> {
    return this.http.post(
      `${this.getEndpoint(settings)}/Hop/v6/getOnboardingUrl`,
      data,
      {
        headers: {
          'X-API-Key': settings.apiKey,
          'X-Vtex-Use-Https': 'true',
          'Content-Type': 'application/json',
        },
        metric: 'adyen-getOnboardingURL',
      }
    )
  }
}

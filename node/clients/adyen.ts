/* eslint-disable @typescript-eslint/consistent-type-imports */
import { ExternalClient, InstanceOptions, IOContext } from '@vtex/api'

const TEST_URL = 'https://cal-test.adyen.com/cal/services' as const

interface GetOnboardingUrlArgs {
  data: GetOnboardingUrlRequest
  urlToken: string
  settings: any
}

export default class Adyen extends ExternalClient {
  constructor(protected context: IOContext, options?: InstanceOptions) {
    super('', context, options)
  }

  private getEndpoint(settings: any) {
    return this.context.production ? settings.productionAPI : TEST_URL
  }

  public async createAccountHolder(
    accountHolder: CreateAccountHolderRequest,
    settings: any
  ): Promise<CreateAccountHolderResponse | null> {
    try {
      return await this.http.post(
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
    } catch (error) {
      if (error.response?.data?.invalidFields) {
        return error.response.data
      }

      return null
    }
  }

  public async getAccountHolder(
    accountHolderCode: string,
    settings: any
  ): Promise<GetAccountHolderResponse | null> {
    try {
      return await this.http.post(
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
    } catch (_err) {
      return null
    }
  }

  public async updateAccount({ data, settings }: any): Promise<any | null> {
    const { accountCode, schedule } = data

    try {
      return await this.http.post(
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
    } catch (err) {
      return null
    }
  }

  public async getOnboardingUrl({
    data,
    settings,
  }: GetOnboardingUrlArgs): Promise<GetOnboardingUrlResponse | null> {
    try {
      return await this.http.post(
        `${this.getEndpoint(settings)}/Hop/v6/getOnboardingUrl`,
        {
          ...data,
          returnUrl: `https://${
            this.context.production ? `` : `${this.context.workspace}--`
          }${
            this.context.account
          }.myvtex.com/marketplace/onboard-complete/?account=${
            data.accountHolderCode
          }`,
        },
        {
          headers: {
            'X-API-Key': settings.apiKey,
            'X-Vtex-Use-Https': 'true',
            'Content-Type': 'application/json',
          },
          metric: 'adyen-getOnboardingURL',
        }
      )
    } catch (error) {
      return null
    }
  }
}

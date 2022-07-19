import type {
  CreateAccountHolderDTO,
  AccountUpdateDTO,
} from '../api/resolvers/adyen'
import { service } from '.'
import { settings } from './utils'

export default {
  createAccountHolder: async ({
    ctx,
    data,
  }: {
    ctx: Context
    data: CreateAccountHolderDTO
  }) => {
    const {
      clients: { adyenClient, account },
      vtex: { logger },
    } = ctx

    const {
      country,
      legalBusinessName,
      legalEntity,
      email,
      sellerId,
      processingTier,
    } = data

    const accountHolder = {
      accountHolderCode: data.accountHolderCode,
      legalEntity,
      processingTier,
      accountHolderDetails: {
        address: {
          country,
        },
        businessDetails: {
          legalBusinessName,
        },
        email,
      },
    }

    try {
      const adyenAccountHolder = await adyenClient.createAccountHolder(
        accountHolder,
        await settings(ctx)
      )

      if (!adyenAccountHolder) return

      const { accountHolderCode, accountHolderStatus, accountCode } =
        adyenAccountHolder

      const onboarding = await service.onboarding.create(ctx, accountHolderCode)

      await account.save({
        data: {
          sellerId,
          accountHolderCode,
          accountCode,
          status: accountHolderStatus.status,
        },
      })

      return {
        onboarding,
        adyenAccountHolder: accountHolder,
        invalidFields: null,
      }
    } catch (error) {
      logger.warn({
        error,
        message: 'adyenPlatforms-createAccountHolder',
      })

      if (error.response?.data?.invalidFields?.length) {
        return { invalidFields: error.response?.data?.invalidFields }
      }

      return null
    }
  },
  getAccountHolder: async ({
    ctx,
    data,
  }: {
    ctx: Context
    data: { sellerId: string }
  }) => {
    const {
      clients: { adyenClient },
      vtex: { logger },
    } = ctx

    const accounts = await service.account.findBySellerId({
      ctx,
      sellerIds: [data.sellerId],
    })

    if (!accounts) return null

    let [{ accountHolderCode }] = accounts

    for (const account of accounts) {
      if (account.status !== 'Closed') {
        accountHolderCode = account.accountHolderCode
        break
      }
    }

    try {
      const accountHolderResult = await adyenClient.getAccountHolder(
        accountHolderCode,
        await settings(ctx)
      )

      return accountHolderResult
    } catch (error) {
      logger.warn({
        error,
        message: 'adyenPlatforms-getAccountHolder',
      })

      return null
    }
  },
  updateAccount: async ({
    ctx,
    data,
  }: {
    ctx: Context
    data: AccountUpdateDTO
  }) => {
    const {
      clients: { adyenClient },
      vtex: { logger },
    } = ctx

    try {
      const response = await adyenClient.updateAccount({
        settings: await settings(ctx),
        data,
      })

      return {
        accountCode: response.accountCode,
        schedule: response.payoutSchedule.schedule,
      }
    } catch (error) {
      logger.warn({
        error,
        message: 'adyenPlatforms-updateAccount',
      })

      return null
    }
  },
  closeAccountHolder: async ({
    ctx,
    data: { accountHolderCode },
  }: {
    ctx: Context
    data: { accountHolderCode: string }
  }) => {
    const {
      clients: { adyenClient, account: accountClient },
      vtex: { logger },
    } = ctx

    try {
      const response = await adyenClient.closeAccountHolder(
        accountHolderCode,
        await settings(ctx)
      )

      if (
        !response?.accountHolderStatus ||
        response.accountHolderStatus.status !== 'Closed'
      ) {
        return null
      }

      const account = await accountClient.find({ accountHolderCode })

      if (!account) return

      const { id, ...update } = account

      await accountClient.update(id, { ...update, status: 'Closed' })

      return response.accountHolderStatus
    } catch (error) {
      logger.warn({
        error,
        message: 'adyenPlatforms-closeAccountHolder',
      })
    }
  },
}

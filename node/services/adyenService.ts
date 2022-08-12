import type {
  CreateAccountHolderDTO,
  AccountUpdateDTO,
} from '../api/resolvers/adyen'
import { service } from '.'
import { settings, replaceDefaultSchedule } from './utils'

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
      if (error.response?.data?.invalidFields?.length) {
        logger.warn({
          error,
          message: 'adyenPlatforms-createAccountHolderInvalidFields',
        })

        return { invalidFields: error.response?.data?.invalidFields }
      }

      logger.error({
        error,
        message: 'adyenPlatforms-createAccountHolderError',
      })

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

    let [{ accountHolderCode, accountCode }] = accounts

    for (const account of accounts) {
      if (account.status !== 'Closed') {
        accountHolderCode = account.accountHolderCode
        accountCode = account.accountCode
        break
      }
    }

    try {
      const accountHolder = await adyenClient.getAccountHolder(
        accountHolderCode,
        await settings(ctx)
      )

      accountHolder.accounts = await replaceDefaultSchedule(
        ctx,
        accountHolder.accounts,
        accountCode
      )

      return accountHolder
    } catch (error) {
      logger.error({
        error,
        message: 'adyenPlatforms-getAccountHolderError',
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
      clients: { adyenClient, vbase },
      vtex: { logger },
    } = ctx

    try {
      const response = await adyenClient.updateAccount({
        settings: await settings(ctx),
        data,
      })

      const {
        accountCode,
        payoutSchedule: { schedule },
      } = response

      const updatedPayoutSchedules = await vbase.getJSON<{
        [accountCode: string]: string
      }>('adyen-platforms', 'updatedPayoutSchedule', true)

      await vbase.saveJSON('adyen-platforms', 'updatedPayoutSchedule', {
        ...updatedPayoutSchedules,
        [accountCode]: schedule,
      })

      return {
        accountCode,
        schedule,
      }
    } catch (error) {
      logger.error({
        error,
        message: 'adyenPlatforms-updateAccountError',
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

      const accounts = await accountClient.find({ accountHolderCode })

      if (!accounts.length) return

      const account = accounts.find(a => a.status === 'Active') ?? accounts[0]

      const { id, ...update } = account

      await accountClient.update(id, { ...update, status: 'Closed' })

      return response.accountHolderStatus
    } catch (error) {
      logger.error({
        error,
        message: 'adyenPlatforms-closeAccountHolderError',
      })
    }
  },
}

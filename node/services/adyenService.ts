import type {
  CreateAccountHolderDTO,
  AccountUpdateDTO,
} from '../api/resolvers/adyen'
import { service } from '.'
import { settings } from '../utils'

export default {
  createAccountHolder: async ({
    ctx,
    data,
  }: {
    ctx: Context
    data: CreateAccountHolderDTO
  }) => {
    const { country, legalBusinessName, legalEntity, email, sellerId } = data

    const accountHolder = {
      accountHolderCode: data.accountHolderCode,
      legalEntity,
      processingTier: 3,
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

    const adyenAccountHolder =
      await ctx.clients.adyenClient.createAccountHolder(
        accountHolder,
        await settings(ctx)
      )

    if (!adyenAccountHolder) return
    if (adyenAccountHolder.invalidFields?.length) {
      return { invalidFields: adyenAccountHolder.invalidFields }
    }

    const { accountHolderCode, accountHolderStatus, accountCode } =
      adyenAccountHolder

    const onboarding = await service.onboarding.create(ctx, accountHolderCode)

    await ctx.clients.account.save({
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
  },
  getAccountHolder: async ({
    ctx,
    data,
  }: {
    ctx: Context
    data: { sellerId: string }
  }) => {
    const accounts = await service.account.findBySellerId({
      ctx,
      sellerIds: [data.sellerId],
    })

    if (!accounts) return null

    const [{ accountHolderCode }] = accounts

    return ctx.clients.adyenClient.getAccountHolder(
      accountHolderCode,
      await settings(ctx)
    )
  },
  updateAccount: async ({
    ctx,
    data,
  }: {
    ctx: Context
    data: AccountUpdateDTO
  }) => {
    const response = await ctx.clients.adyenClient.updateAccount({
      settings: await settings(ctx),
      data,
    })

    return {
      accountCode: response.accountCode,
      schedule: response.payoutSchedule.schedule,
    }
  },
  closeAccountHolder: async ({
    ctx,
    data: { accountHolderCode },
  }: {
    ctx: Context
    data: { accountHolderCode: string }
  }) => {
    const response = await ctx.clients.adyenClient.closeAccountHolder(
      accountHolderCode,
      await settings(ctx)
    )

    if (
      !response?.accountHolderStatus ||
      response.accountHolderStatus.status !== 'Closed'
    ) {
      return null
    }

    const account = await ctx.clients.account.find({ accountHolderCode })

    if (!account) return

    const { id, ...update } = account

    ctx.clients.account.update(id, { ...update, status: 'Closed' })

    return response.accountHolderStatus
  },
}

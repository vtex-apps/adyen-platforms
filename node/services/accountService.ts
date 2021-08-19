import { v4 as uuidv4 } from 'uuid'

import type {
  CreateAccountHolderDTO,
  AccountUpdateDTO,
} from '../api/resolvers/adyen'
import { settings } from '../utils'

const ONE_DAY = 86400000 as const

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
      accountHolderDetails: {
        address: {
          country,
        },
        businessDetails: {
          legalBusinessName,
        },
        email,
      },
      legalEntity,
      processingTier: 3,
    }

    const adyenAccount = await ctx.clients.adyenClient.createAccountHolder(
      accountHolder,
      await settings(ctx)
    )

    if (!adyenAccount) return
    if (adyenAccount.invalidFields?.length) {
      return { invalidFields: adyenAccount.invalidFields }
    }

    const urlToken = uuidv4()
    const expirationTimestamp = Date.now() + 7 * ONE_DAY
    const { accountHolderCode, accountHolderStatus, accountCode } = adyenAccount

    await ctx.clients.onboarding.create({
      data: {
        accountHolderCode,
        urlToken,
        expirationTimestamp,
      },
    })

    await ctx.clients.account.save({
      data: {
        sellerId,
        accountHolderCode,
        accountCode,
        status: accountHolderStatus.status,
      },
    })

    return {
      accountHolderCode,
      urlToken,
      invalidFields: null,
    }
  },
  getAccountHolder: async ({
    ctx,
    data,
  }: {
    ctx: Context
    data: { accountHolderCode: string }
  }) => {
    const adyenAccountHolder = await ctx.clients.adyenClient.getAccountHolder(
      data.accountHolderCode,
      await settings(ctx)
    )

    return adyenAccountHolder
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
  deleteAccountHolder: async ({
    ctx,
    data: { accountHolderCode },
  }: {
    ctx: Context
    data: { accountHolderCode: string }
  }) => {
    console.log(accountHolderCode)
    const response = await ctx.clients.adyenClient.deleteAccountHolder(
      accountHolderCode,
      await settings(ctx)
    )

    console.log(response)

    if (
      !response.accountHolderStatus ||
      response.accountHolderStatus.status !== 'Closed'
    ) {
      return null
    }

    const account = await ctx.clients.account.find({ accountHolderCode })

    console.log(account)

    if (!account) return

    const { id, ...update } = account

    ctx.clients.account.update(id, { ...update, status: 'Closed' })

    return response.accountHolderStatus
  },
  findBySellerId: async ({
    ctx,
    sellerIds,
  }: {
    ctx: Context
    sellerIds: string[]
  }) => {
    return ctx.clients.account.findBySellerId(sellerIds)
  },
}

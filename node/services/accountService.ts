import { v4 as uuidv4 } from 'uuid'

import type {
  CreateAccountHolderDTO,
  AccountUpdateDTO,
} from '../api/resolvers/adyen'
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
    }

    const adyenAccount = await ctx.clients.adyenClient.createAccountHolder(
      accountHolder,
      await settings(ctx)
    )

    if (!adyenAccount) return

    const urlToken = uuidv4()

    const { accountHolderCode, accountHolderStatus, accountCode } = adyenAccount

    await ctx.clients.onboarding.create({
      data: {
        accountHolderCode,
        onboardComplete: false,
        urlToken,
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
      onboardComplete: false,
      urlToken,
    }
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
  // updateAccountHolder: async ({ ctx, data }: { ctx: Context; data: any }) => {
  //   const {
  //     update: {
  //       accountHolderCode,
  //       firstName,
  //       lastName,
  //       jobTitle,
  //       dateOfBirth,
  //       city,
  //       country,
  //       houseNumberOrName,
  //       postalCode,
  //       street,
  //       stateOrProvince,
  //       email,
  //       fullPhoneNumber,
  //     },
  //   } = data

  //   const update = {
  //     accountHolderCode,
  //     accountHolderDetails: {
  //       businessDetails: {
  //         signatories: [
  //           {
  //             name: {
  //               firstName,
  //               lastName,
  //             },
  //             jobTitle,
  //             personalData: {
  //               dateOfBirth,
  //             },
  //             address: {
  //               city,
  //               country,
  //               houseNumberOrName,
  //               postalCode,
  //               street,
  //               stateOrProvince,
  //             },
  //             email,
  //             fullPhoneNumber,
  //           },
  //         ],
  //       },
  //     },
  //   }

  //   console.log('update req ==>', update)
  //   const response = await ctx.clients.adyenClient.updateAccountHolder({
  //     settings: await settings(ctx),
  //     data: update,
  //   })

  //   console.log('update resp ==>', JSON.stringify(response))

  //   return true
  // },
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

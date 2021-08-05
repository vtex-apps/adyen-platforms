import { settings } from '../utils'

export default {
  all: async ({ ctx }: { ctx: Context }) => {
    const sellers = await ctx.clients.sellersClient.sellers()
    const adyenAccounts = await ctx.clients.account.all()

    const response = sellers.map(seller => {
      const adyenAccount = adyenAccounts.find(
        account => account.sellerId === seller.id
      )

      return {
        ...seller,
        adyenAccount,
      }
    })

    return response
  },
  findOne: async (sellerId: string, ctx: Context) => {
    const seller = await ctx.clients.sellersClient.seller(sellerId)
    const account = await ctx.clients.account.find({ sellerId })

    if (!account) return seller
    const adyenAccountHolder = await ctx.clients.adyenClient.getAccountHolder(
      account.accountHolderCode,
      await settings(ctx)
    )

    const adyenOnboarding = await ctx.clients.onboarding.find({
      accountHolderCode: account.accountHolderCode,
    })

    return {
      ...seller,
      adyenOnboarding,
      adyenAccountHolder,
    }
  },
}

import { settings } from '../utils'

export default {
  all: async ({ ctx }: { ctx: Context }) => {
    const sellers = await ctx.clients.sellersClient.sellers()
    const adyenAccounts = await ctx.clients.account.all()

    const response = sellers.reduce((prev, seller) => {
      if (seller.account === ctx.vtex.account) return prev

      const adyenAccount = adyenAccounts.find(
        account => account.sellerId === seller.id
      )

      prev.push({
        ...seller,
        adyenAccount,
      })

      return prev
    }, [] as any)

    console.log(response)

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

    console.log({
      ...seller,
      adyenOnboarding,
      adyenAccountHolder,
    })

    return {
      ...seller,
      adyenOnboarding,
      adyenAccountHolder,
    }
  },
}

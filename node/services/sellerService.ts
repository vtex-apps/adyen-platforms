import { settings } from '../utils'

export default {
  all: async ({ ctx }: { ctx: Context }) => {
    const sellers = await ctx.clients.sellersClient.sellers()
    const adyenAccounts = await ctx.clients.account.all()

    const response = sellers.reduce((prev, seller) => {
      if (seller.account === ctx.vtex.account) return prev

      let adyenAccount: SellerAccount | null = null

      for (const account of adyenAccounts) {
        if (
          account.sellerId === seller.id &&
          (!adyenAccount || account.status === 'Active')
        ) {
          adyenAccount = account
          if (account.status === 'Active') {
            break
          }
        }
      }

      prev.push({
        ...seller,
        adyenAccount,
      })

      return prev
    }, [] as any)

    const settingsFetch = await settings(ctx)

    for (const seller of response) {
      if (seller?.adyenAccount) {
        // eslint-disable-next-line no-await-in-loop
        const accountStatus = await ctx.clients.adyenClient.getAccountHolder(
          seller?.adyenAccount?.accountHolderCode,
          settingsFetch
        )

        seller.adyenAccount.status =
          accountStatus?.accountHolderStatus.status ??
          seller.adyenAccount.status
      }
    }

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

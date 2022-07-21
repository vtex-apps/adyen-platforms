import { settings } from './utils'

export default {
  all: async ({ ctx }: { ctx: Context }) => {
    const {
      clients: { sellersClient, account: accountClient, adyenClient },
      vtex: { logger, account: currentAccount },
    } = ctx

    try {
      const sellers = await sellersClient.sellers()
      const adyenAccounts = await accountClient.all()
      const settingsFetch = await settings(ctx)

      const response = await Promise.all(
        sellers
          .reduce((prev, seller) => {
            if (seller.account === currentAccount) return prev

            let adyenAccount: SellerAccount | null = null

            for (const account of adyenAccounts) {
              if (
                account.sellerId === seller.id &&
                !(adyenAccount?.status === 'Active') &&
                (!adyenAccount || account.status === 'Active')
              ) {
                adyenAccount = account
              }
            }

            prev.push({
              ...seller,
              adyenAccount,
            })

            return prev
          }, [] as any)
          .map(async (seller: any) => {
            if (seller?.adyenAccount) {
              const accountStatus = await adyenClient.getAccountHolder(
                seller?.adyenAccount?.accountHolderCode,
                settingsFetch
              )

              seller.adyenAccount.status =
                accountStatus?.accountHolderStatus.status ??
                seller.adyenAccount.status
            }

            return seller
          })
      )

      return response
    } catch (error) {
      logger.warn({
        error,
        message: 'adyenPlatform-allSellers',
      })

      return []
    }
  },
  findOne: async (sellerId: string, ctx: Context) => {
    const {
      clients: {
        sellersClient,
        account: accountClient,
        adyenClient,
        onboarding: onboardingClient,
      },
      vtex: { logger },
    } = ctx

    try {
      const seller = await sellersClient.seller(sellerId)
      const account = await accountClient.find({ sellerId })

      if (!account) return seller
      const adyenAccountHolder = await adyenClient.getAccountHolder(
        account.accountHolderCode,
        await settings(ctx)
      )

      const adyenOnboarding = await onboardingClient.find({
        accountHolderCode: account.accountHolderCode,
      })

      return {
        ...seller,
        adyenOnboarding,
        adyenAccountHolder,
      }
    } catch (error) {
      logger.warn({
        error,
        message: 'adyenPlatform-findOneSeller',
      })

      return {}
    }
  },
}

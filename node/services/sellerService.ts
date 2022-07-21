import { settings } from './utils'

export default {
  all: async ({ ctx }: { ctx: Context }) => {
    const {
      clients: { sellersClient, account: accountClient, adyenClient },
      vtex: { logger, account: currentAccount },
    } = ctx

    try {
      const { items: sellers } = await sellersClient.sellers()
      const { data: adyenAccounts } = await accountClient.all()
      const settingsFetch = await settings(ctx)

      const response = await Promise.all(
        sellers
          .reduce((prev, seller) => {
            if (seller.account === currentAccount) return prev

            let adyenAccount: SellerAccount | null = null

            for (const account of adyenAccounts) {
              if (
                account.sellerId === seller.id &&
                adyenAccount?.status !== 'Active' &&
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
      logger.error({
        error,
        message: 'adyenPlatform-getAllSellersError',
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
      const accounts = await accountClient.find({ sellerId })

      if (!accounts.length) return seller

      const account = accounts.find(a => a.status === 'Active') ?? accounts[0]

      const adyenAccountHolder = await adyenClient.getAccountHolder(
        account.accountHolderCode,
        await settings(ctx)
      )

      const [onboarding] =
        (await onboardingClient.find({
          accountHolderCode: account.accountHolderCode,
        })) ?? []

      const adyenOnboarding = onboarding ?? null

      return {
        ...seller,
        adyenOnboarding,
        adyenAccountHolder,
      }
    } catch (error) {
      if (error.response.status === 404) {
        logger.warn({
          error,
          message: 'adyenPlatform-findOneSellerNotFound',
        })
      } else {
        logger.error({
          error,
          message: 'adyenPlatform-findOneSellerError',
        })
      }

      return {}
    }
  },
}

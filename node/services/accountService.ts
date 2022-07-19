export default {
  findBySellerId: async ({
    ctx,
    sellerIds,
  }: {
    ctx: Context
    sellerIds: string[]
  }) => {
    const {
      clients: { account },
      vtex: { logger },
    } = ctx

    try {
      return account.findBySellerId(sellerIds)
    } catch (error) {
      logger.warn({
        error,
        message: 'adyenPlatforms-findBySellerId',
      })

      return null
    }
  },
}

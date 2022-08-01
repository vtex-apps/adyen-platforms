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
      return await account.findBySellerId(sellerIds)
    } catch (error) {
      if (error.response.status === 404) {
        logger.warn({
          error,
          message: 'adyenPlatforms-findBySellerIdNotFound',
        })
      } else {
        logger.error({
          error,
          message: 'adyenPlatforms-findBySellerIdError',
        })
      }

      return null
    }
  },
}

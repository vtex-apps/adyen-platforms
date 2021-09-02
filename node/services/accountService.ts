export default {
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

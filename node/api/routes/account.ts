import accountService from '../../services/accountService'

const account = async (ctx: Context) => {
  const { seller } = ctx.request.query

  if (!seller.length) {
    return
  }

  const sellerIds = typeof seller === 'string' ? [seller] : seller

  ctx.body = await accountService.findBySellerId({ ctx, sellerIds })
}

export default account

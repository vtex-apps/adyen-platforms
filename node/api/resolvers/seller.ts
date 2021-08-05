import { service } from '../../services'

export const sellerQueries = {
  sellers: async (_: any, __: any, ctx: Context) => {
    return service.seller.all({ ctx })
  },

  seller: async (_: any, data: any, ctx: Context) => {
    return service.seller.findOne(data.sellerId, ctx)
  },
}

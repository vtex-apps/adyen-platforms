import { adyenMutations } from './adyen'
import { sellerQueries } from './seller'

export const resolvers = {
  Mutation: {
    ...adyenMutations,
  },
  Query: { ...sellerQueries },
}

import { adyenMutations, adyenQueries } from './adyen'
import { onboardingMutations } from './onboarding'
import { sellerQueries } from './seller'

export const resolvers = {
  Mutation: {
    ...onboardingMutations,
    ...adyenMutations,
  },
  Query: { ...sellerQueries, ...adyenQueries },
}

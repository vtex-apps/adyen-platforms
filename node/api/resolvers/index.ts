import { adyenMutations, adyenQueries } from './adyen'
import { onboardingMutations, onboardingQueries } from './onboarding'
import { sellerQueries } from './seller'

export const resolvers = {
  Mutation: {
    ...onboardingMutations,
    ...adyenMutations,
  },
  Query: { ...sellerQueries, ...onboardingQueries, ...adyenQueries },
}

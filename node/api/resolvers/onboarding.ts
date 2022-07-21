import { service } from '../../services'

export const onboardingMutations = {
  onboardingComplete: async (
    _: unknown,
    data: { accountHolderCode: string },
    ctx: Context
  ) => {
    const {
      clients: { onboarding: onboardingClient },
      vtex: { logger },
    } = ctx

    try {
      const onboarding = await onboardingClient.find(data)

      if (!onboarding) return

      const { id, ...update } = onboarding

      await onboardingClient.update(id, {
        ...update,
        urlToken: null,
        expirationTimestamp: null,
      })
    } catch (error) {
      logger.error({
        error,
        message: 'adyenPlatform-completeOnboardingError',
      })
    }
  },
  refreshOnboarding: async (
    _: unknown,
    data: { accountHolderCode: string },
    ctx: Context
  ) => {
    return service.onboarding.refreshOnboarding(ctx, data)
  },
}

export const onboardingQueries = {
  onboarding: async (
    _: unknown,
    { accountHolderCode }: { accountHolderCode: string },
    ctx: Context
  ) => {
    return service.onboarding.getOnboarding(ctx, accountHolderCode)
  },
}

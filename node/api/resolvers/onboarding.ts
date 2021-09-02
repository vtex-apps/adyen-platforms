import { service } from '../../services'

export const onboardingMutations = {
  onboardingComplete: async (
    _: unknown,
    data: { accountHolderCode: string },
    ctx: Context
  ) => {
    const onboarding = await ctx.clients.onboarding.find(data)

    if (!onboarding) return

    const { id, ...update } = onboarding

    await ctx.clients.onboarding.update(id, {
      ...update,
      urlToken: null,
      expirationTimestamp: null,
    })
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

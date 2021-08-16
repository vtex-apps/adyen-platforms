import { v4 as uuidv4 } from 'uuid'

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
      onboardComplete: true,
    })
  },
  refreshOnboarding: async (
    _: unknown,
    data: { accountHolderCode: string },
    ctx: Context
  ) => {
    const onboarding = await ctx.clients.onboarding.find(data)

    if (!onboarding) return

    const { id, ...update } = onboarding

    await ctx.clients.onboarding.update(id, {
      ...update,
      onboardComplete: false,
      urlToken: uuidv4(),
      expirationTimestamp: Date.now(),
    })
  },
}

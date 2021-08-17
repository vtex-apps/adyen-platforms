import { v4 as uuidv4 } from 'uuid'

const ONE_DAY = 86400000 as const

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
    const onboarding = await ctx.clients.onboarding.find(data)

    if (!onboarding) return

    const { id, ...update } = onboarding

    update.urlToken = uuidv4()

    await ctx.clients.onboarding.update(id, {
      ...update,
      expirationTimestamp: Date.now() + 7 * ONE_DAY,
    })

    return update
  },
}

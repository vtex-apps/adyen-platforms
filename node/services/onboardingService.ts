import { settings } from '../utils'

export default {
  getOnboardingUrl: async (ctx: Context, urlToken: string) => {
    const onboarding = await ctx.clients.onboarding.find({ urlToken })

    if (!onboarding) return null

    if (onboarding.expirationTimestamp < Date.now()) {
      throw new Error('Link has expired')
    }

    const adyenOnboarding = await ctx.clients.adyenClient.getOnboardingUrl({
      data: { accountHolderCode: onboarding.accountHolderCode },
      urlToken,
      settings: await settings(ctx),
    })

    return adyenOnboarding?.redirectUrl ?? null
  },
}

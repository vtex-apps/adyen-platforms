import { settings } from '../utils'

const buildUrl = (ctx: any, accountHolderCode: any) => {
  return `https://${ctx.vtex.production ? `` : `${ctx.vtex.workspace}--`}${
    ctx.vtex.account
  }.myvtex.com/marketplace/onboard-complete/?account=${accountHolderCode}`
}

export default {
  getOnboardingUrl: async (ctx: Context, urlToken: string) => {
    const onboarding = await ctx.clients.onboarding.find({ urlToken })

    if (!onboarding) return null

    if (onboarding.expirationTimestamp < Date.now()) {
      throw new Error('Link has expired')
    }

    const appSettings = await settings(ctx)
    const onboardingCompleteRedirect = appSettings.onboardingRedirectUrl
      ? appSettings.onboardingRedirectUrl
      : buildUrl(ctx, onboarding.accountHolderCode)

    const adyenOnboarding = await ctx.clients.adyenClient.getOnboardingUrl({
      data: {
        accountHolderCode: onboarding.accountHolderCode,
        returnUrl: onboardingCompleteRedirect,
      },
      settings: appSettings,
    })

    return adyenOnboarding?.redirectUrl ?? null
  },
}

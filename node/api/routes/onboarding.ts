import { settings } from '../../utils'

const startOnboarding = async (ctx: Context) => {
  const { token: urlToken } = ctx.request.query

  if (!urlToken || typeof urlToken !== 'string') {
    return
  }

  const onboarding = await ctx.clients.onboarding.find({ urlToken })

  if (!onboarding) return

  if (onboarding.expirationTimestamp < Date.now()) return

  const adyenOnboarding = await ctx.clients.adyenClient.getOnboardingUrl({
    data: { accountHolderCode: onboarding.accountHolderCode },
    urlToken,
    settings: await settings(ctx),
  })

  if (!adyenOnboarding?.redirectUrl) return

  ctx.redirect(adyenOnboarding.redirectUrl)
}

export default startOnboarding

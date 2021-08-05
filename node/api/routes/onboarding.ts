import { settings } from '../../utils'

const onboarding = async (ctx: Context) => {
  const { token: urlToken } = ctx.request.query

  if (!urlToken || typeof urlToken !== 'string') {
    return
  }

  const account = await ctx.clients.onboarding.find({ urlToken })

  if (!account) return

  const adyenOnboarding = await ctx.clients.adyenClient.getOnboardingUrl({
    data: { accountHolderCode: account.accountHolderCode },
    urlToken,
    settings: await settings(ctx),
  })

  if (!adyenOnboarding?.redirectUrl) return

  ctx.redirect(adyenOnboarding.redirectUrl)
}

export default onboarding

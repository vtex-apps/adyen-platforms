import { service } from '../../services'

const startOnboarding = async (ctx: Context) => {
  const { token: urlToken } = ctx.request.query

  if (!urlToken || typeof urlToken !== 'string') return

  try {
    const onboardingUrl = await service.onboarding.getOnboardingUrl(
      ctx,
      urlToken
    )

    if (!onboardingUrl) return

    return ctx.redirect(onboardingUrl)
  } catch (err) {
    return (ctx.response.message = err.message)
  }
}

export default startOnboarding

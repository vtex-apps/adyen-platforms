import { service } from '../../services'

const startOnboarding = async (ctx: Context) => {
  const {
    request: {
      query: { token: urlToken },
    },
    vtex: { logger },
  } = ctx

  if (!urlToken || typeof urlToken !== 'string') return

  try {
    const onboardingUrl = await service.onboarding.getOnboardingUrl(
      ctx,
      urlToken
    )

    if (!onboardingUrl) return

    return ctx.redirect(onboardingUrl)
  } catch (error) {
    logger.warn({
      error,
      message: 'adyenPlatforms-startOnboarding',
    })

    return (ctx.response.message = error.message)
  }
}

export default startOnboarding

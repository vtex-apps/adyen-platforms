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
    logger.error({
      error,
      message: 'adyenPlatforms-startOnboardingError',
    })

    // displays specific message (e.g "Link has expired") instead of generic "Not Found" when accessing expired/invalid onboarding page
    ctx.response.message = error.response?.data?.message ?? error.message
  }
}

export default startOnboarding

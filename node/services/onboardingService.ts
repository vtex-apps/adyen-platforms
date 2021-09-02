import { v4 as uuidv4 } from 'uuid'

import { settings } from '../utils'

const ONE_DAY = 86400000 as const

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
  getOnboarding: async (ctx: Context, accountHolderCode: string) => {
    return ctx.clients.onboarding.find({
      accountHolderCode,
    })
  },
  create: async (ctx: Context, accountHolderCode: string) => {
    const urlToken = uuidv4()
    const expirationTimestamp = Date.now() + 7 * ONE_DAY

    await ctx.clients.onboarding.create({
      data: {
        accountHolderCode,
        urlToken,
        expirationTimestamp,
      },
    })

    return {
      accountHolderCode,
      urlToken,
    }
  },
  refreshOnboarding: async (
    ctx: Context,
    data: { accountHolderCode: string }
  ) => {
    const onboarding = await ctx.clients.onboarding.find(data)

    if (!onboarding) return null

    const { id, ...update } = onboarding

    update.urlToken = uuidv4()

    await ctx.clients.onboarding.update(id, {
      ...update,
      expirationTimestamp: Date.now() + 7 * ONE_DAY,
    })

    return update
  },
}

const appId = process.env.VTEX_APP_ID as string

export const settings = async (context: Context): Promise<any> => {
  try {
    return context.clients.apps.getAppSettings(appId)
  } catch (error) {
    context.vtex.logger.error({
      error,
      message: 'adyenPlatforms-getAppSettings',
    })

    return null
  }
}

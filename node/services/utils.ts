const appId = process.env.VTEX_APP_ID as string

export const settings = async (context: Context): Promise<any> => {
  const {
    clients: { apps },
    vtex: { logger },
  } = context

  try {
    return apps.getAppSettings(appId)
  } catch (error) {
    logger.warn({
      error,
      message: 'adyenPlatforms-getAppSettings',
    })

    return null
  }
}

const appId = process.env.VTEX_APP_ID as string

export const settings = async (context: Context): Promise<any> => {
  const {
    clients: { apps },
    vtex: { logger },
  } = context

  try {
    return await apps.getAppSettings(appId)
  } catch (error) {
    logger.error({
      error,
      message: 'adyenPlatforms-getAppSettingsError',
    })

    return null
  }
}

export const replaceDefaultSchedule = async (
  context: Context,
  accounts: Account[],
  accountCode: string
): Promise<Account[]> => {
  const {
    clients: { vbase },
  } = context

  const savedPayoutSchedules = await vbase.getJSON<{
    [accountCode: string]: string
  }>('adyen-platforms', 'updatedPayoutSchedule', true)

  if (
    !savedPayoutSchedules ||
    !Object.prototype.hasOwnProperty.call(savedPayoutSchedules, accountCode)
  ) {
    return accounts
  }

  return accounts.map(account => {
    if (
      accountCode === account.accountCode &&
      account.payoutSchedule?.schedule === 'DEFAULT'
    ) {
      return {
        ...account,
        payoutSchedule: {
          schedule: savedPayoutSchedules[accountCode],
        },
      }
    }

    return account
  })
}

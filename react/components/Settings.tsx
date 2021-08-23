import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { Box, Text, Card, Input, Button, toast } from '@vtex/admin-ui'
import { useMutation, useQuery } from 'react-apollo'

import SaveAppSettings from '../graphql/SaveAppSettings.graphql'
import AppSettings from '../graphql/AppSettings.graphql'

const Settings: FC<any> = () => {
  const [settingsState, setSettingsState] = useState({
    apiKey: '',
    productionAPI: '',
    onboardingRedirectUrl: '',
  })

  const { data: settings } = useQuery(AppSettings, {
    variables: {
      version: process.env.VTEX_APP_VERSION,
    },
    ssr: false,
  })

  useEffect(() => {
    if (!settings?.appSettings?.message) return

    const parsedSettings = JSON.parse(settings.appSettings.message)

    setSettingsState(parsedSettings)
  }, [settings])

  const [saveSettings] = useMutation(SaveAppSettings)

  const [settingsLoading, setSettingsLoading] = useState(false)
  const handleSaveSettings = async () => {
    setSettingsLoading(true)

    try {
      await saveSettings({
        variables: {
          version: process.env.VTEX_APP_VERSION,
          settings: JSON.stringify(settingsState),
        },
      })
    } catch (err) {
      console.error(err)
      toast.dispatch({
        type: 'error',
        message: 'Error saving app settings',
      })

      setSettingsLoading(false)

      return
    }

    toast.dispatch({
      type: 'success',
      message: 'App settings saved',
    })
    setSettingsLoading(false)
  }

  return (
    <Card csx={{ marginTop: 2 }}>
      <Text variant="subtitle">Adyen for Platforms configuration settings</Text>
      <Box csx={{ marginTop: 9, width: '50%' }}>
        <Input
          id="apiKey"
          label="API Key"
          helperText="Enter your Adyen for Platforms API Key"
          value={settingsState.apiKey}
          onChange={(e: React.FormEvent<HTMLInputElement>) =>
            setSettingsState({
              ...settingsState,
              apiKey: e.currentTarget.value,
            })
          }
        />
        <Input
          id="liveEndpoint"
          label="Production API Endpoint"
          helperText="Enter your Adyen for Platforms production API endpoint"
          value={settingsState.productionAPI}
          onChange={(e: React.FormEvent<HTMLInputElement>) =>
            setSettingsState({
              ...settingsState,
              productionAPI: e.currentTarget.value,
            })
          }
        />
        <Input
          id="redirectUrl"
          label="Completed Onboarding Redirect URL"
          helperText="After a seller has completed the Adyen onboarding process, you can choose to redirect them to a custom URL. Complete URL must be entered, for example: https://www.my-store.com/onboard-complete"
          value={settingsState.onboardingRedirectUrl}
          onChange={(e: React.FormEvent<HTMLInputElement>) =>
            setSettingsState({
              ...settingsState,
              onboardingRedirectUrl: e.currentTarget.value,
            })
          }
        />
      </Box>
      <Box csx={{ marginTop: '20px' }}>
        <Button
          onClick={() => handleSaveSettings()}
          loading={settingsLoading}
          disabled={!settingsState.apiKey}
        >
          Save
        </Button>
      </Box>
    </Card>
  )
}

export default Settings

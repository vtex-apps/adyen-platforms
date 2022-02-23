/* eslint-disable import/order */
import React, { useContext, useEffect, useState } from 'react'
import type { FC } from 'react'

import {
  Box,
  Set,
  Heading,
  Columns,
  Paragraph,
  Button,
  Tooltip,
  IconDuplicate,
  Input,
  toast,
} from '@vtex/admin-ui'
import { useRuntime } from 'vtex.render-runtime'

import SellerOnboardingModal from './sellerOnboardingModal'
import { useMutation } from 'react-apollo'
import REFRESH_ONBOARDING from '../graphql/RefreshOnboarding.graphql'
import { StateContext } from '../context/StateContext'

const SellerOnboarding: FC<any> = () => {
  const { seller, adyenAccountHolder, onboarding } = useContext(StateContext)

  const [onboardUrl, setOnboardUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { workspace, binding, production } = useRuntime()
  const [refreshOnboarding] = useMutation(REFRESH_ONBOARDING)
  const { urlToken } = onboarding || {}

  useEffect(() => {
    if (urlToken) {
      setOnboardUrl(
        `https://${production ? '' : `${workspace}--`}${
          binding?.canonicalBaseAddress.split('/')[0]
        }/_v/api/adyen-platforms/v0/onboarding?token=${urlToken}`
      )
    }
  }, [
    binding?.canonicalBaseAddress,
    urlToken,
    onboardUrl,
    production,
    workspace,
  ])

  const handleRefresh = async (setContextState: any) => {
    setIsLoading(true)

    try {
      const response = await refreshOnboarding({
        variables: {
          accountHolderCode: adyenAccountHolder.accountHolderCode,
        },
      })

      setContextState({ onboarding: response.data.refreshOnboarding })
    } catch (error) {
      console.error(error)
      setIsLoading(false)

      return
    }

    toast.dispatch({
      type: 'success',
      message: 'Onboarding link created',
    })

    setIsLoading(false)
  }

  const copyText = () => {
    navigator.clipboard.writeText(onboardUrl)

    toast.dispatch({
      type: 'success',
      message: 'Copied to clipboard',
    })
  }

  const isActive =
    adyenAccountHolder &&
    adyenAccountHolder.accountHolderStatus?.status !== 'Closed'

  return (
    <Columns spacing={1}>
      <Columns.Item>
        <Box>
          <Set orientation="vertical" spacing={3} fluid>
            <Heading>Onboarding</Heading>
            <Paragraph csx={{ width: '60%' }}>
              Create a new account and provide the generated link to the account
              holder.
            </Paragraph>
            <Set>
              <SellerOnboardingModal seller={seller} disabled={isActive} />
              {isActive && (
                <StateContext.Consumer>
                  {({ setContextState }) => (
                    <Button
                      variant="primary"
                      loading={isLoading}
                      disabled={
                        adyenAccountHolder.accountHolderStatus?.status !==
                        'Active'
                      }
                      onClick={() => handleRefresh(setContextState)}
                    >
                      Create New Link
                    </Button>
                  )}
                </StateContext.Consumer>
              )}
            </Set>
            {onboardUrl && (
              <Box csx={{ maxWidth: '70%' }}>
                <Input
                  id="1"
                  label="Onboarding Link"
                  value={onboardUrl}
                  disabled
                  buttonElements={
                    <Tooltip label="Copy link" placement="bottom">
                      <Button
                        csx={{ height: '100%' }}
                        onClick={() => copyText()}
                        icon={<IconDuplicate />}
                        disabled={!onboardUrl}
                        variant="tertiary"
                      />
                    </Tooltip>
                  }
                />
              </Box>
            )}
          </Set>
        </Box>
      </Columns.Item>
    </Columns>
  )
}

export default SellerOnboarding

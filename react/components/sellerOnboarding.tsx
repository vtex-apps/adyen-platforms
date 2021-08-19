/* eslint-disable import/order */
import React, { useEffect, useState } from 'react'
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

const SellerOnboarding: FC<any> = ({ data }) => {
  const [onboardUrl, setOnboardUrl] = useState('')
  const [onboardToken, setOnboardToken] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { workspace, binding, production } = useRuntime()
  const [refreshOnboarding] = useMutation(REFRESH_ONBOARDING)

  useEffect(() => {
    if (onboardToken) {
      setOnboardUrl(
        `https://${production ? '' : `${workspace}--`}${
          binding?.canonicalBaseAddress.split('/')[0]
        }/_v/api/adyen-platforms/v0/onboarding?token=${onboardToken}`
      )
    }
  }, [
    binding?.canonicalBaseAddress,
    onboardToken,
    onboardUrl,
    production,
    workspace,
  ])

  if (!onboardToken && data?.seller?.adyenOnboarding?.urlToken) {
    setOnboardToken(data?.seller?.adyenOnboarding?.urlToken)
  }

  const handleRefresh = async () => {
    setIsLoading(true)

    try {
      const onboarding = await refreshOnboarding({
        variables: {
          accountHolderCode: data.seller.adyenAccountHolder.accountHolderCode,
        },
      })

      setOnboardToken(onboarding.data.refreshOnboarding.urlToken)
    } catch (error) {
      console.log(error)
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
    data?.seller?.adyenAccountHolder &&
    data.seller.adyenAccountHolder?.accountHolderStatus.status !== 'Closed'

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
              <SellerOnboardingModal
                data={data}
                setOnboardToken={setOnboardToken}
                disabled={isActive}
              />
              {isActive && (
                <Button
                  variant="primary"
                  loading={isLoading}
                  onClick={() => handleRefresh()}
                >
                  Create New Link
                </Button>
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

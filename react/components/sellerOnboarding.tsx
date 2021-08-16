/* eslint-disable import/order */
import React, { useState } from 'react'
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

import SellerModal from './sellerModal'

const SellerOnboarding: FC<any> = ({ data }) => {
  const [onboardUrl, setOnboardUrl] = useState('')
  const [onboardToken, setOnboardToken] = useState('')
  const { workspace, binding, production } = useRuntime()

  if (
    !onboardUrl &&
    (onboardToken || data?.seller?.adyenOnboarding?.urlToken)
  ) {
    const token = onboardToken || data.seller.adyenOnboarding.urlToken

    setOnboardUrl(
      `https://${production ? '' : `${workspace}--`}${
        binding?.canonicalBaseAddress.split('/')[0]
      }/_v/api/adyen-platforms/v0/onboarding?token=${token}`
    )
  }

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
            <SellerModal
              data={data}
              setOnboardToken={setOnboardToken}
              disabled={!!onboardUrl}
            />
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
                        onClick={() => {
                          navigator.clipboard.writeText(onboardUrl)

                          toast.dispatch({
                            type: 'success',
                            message: 'Copied to clipboard',
                          })
                        }}
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

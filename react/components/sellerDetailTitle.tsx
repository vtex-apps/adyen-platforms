import type { FC } from 'react'
import React from 'react'
// import { FormattedMessage } from 'react-intl'
import {
  Box,
  Set,
  Heading,
  // Text,
  // IconSuccessColorful,
  // IconWarningColorful,
} from '@vtex/admin-ui'

const SellerDetailTitle: FC<any> = ({ seller }: any) => {
  if (!seller) return null

  // const accountHolderStatus =
  //   seller.adyenAccountHolder?.accountHolderStatus || null

  return (
    <Box>
      <Set orientation="vertical" spacing={3} fluid>
        <Heading>{seller.name}</Heading>
        {/* <Box>
          <Set spacing={8}>
            <Set csx={{ alignItems: 'center' }} orientation="vertical">
              <Text variant="highlight">Account</Text>
              {accountHolderStatus?.status === 'Active' ? (
                <Set>
                  <IconSuccessColorful size={20} />
                  <Text variant="highlight">Active</Text>
                </Set>
              ) : (
                <Set>
                  <Text variant="highlight">-</Text>
                </Set>
              )}
            </Set>
            <Set csx={{ alignItems: 'center' }} orientation="vertical">
              <Text variant="highlight">Processing</Text>
              {accountHolderStatus?.processingState.disabled === false ? (
                <Set>
                  <IconSuccessColorful size={20} />
                  <Text variant="highlight">Active</Text>
                </Set>
              ) : accountHolderStatus?.processingState.disabled === true ? (
                <Set>
                  <IconWarningColorful size={20} />
                  <Text variant="highlight">Inactive</Text>
                </Set>
              ) : (
                <Set>
                  <Text variant="highlight">-</Text>
                </Set>
              )}
            </Set>
            <Set csx={{ alignItems: 'center' }} orientation="vertical">
              <Text variant="highlight">Payout</Text>
              {accountHolderStatus?.payoutState.disabled === false ? (
                <Set>
                  <IconSuccessColorful size={20} />
                  <Text variant="highlight">Active</Text>
                </Set>
              ) : accountHolderStatus?.payoutState.disabled === true ? (
                <Set>
                  <IconWarningColorful size={20} />
                  <Text variant="highlight">Inactive</Text>
                </Set>
              ) : (
                <Set>
                  <Text variant="highlight">-</Text>
                </Set>
              )}
            </Set>
          </Set>
        </Box> */}
      </Set>
    </Box>
  )
}

export default SellerDetailTitle

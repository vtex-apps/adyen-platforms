import type { FC } from 'react'
import React, { useContext } from 'react'
import { Set, Columns, Heading, Text, Box } from '@vtex/admin-ui'

import SellerCloseAccountModal from './sellerCloseAccountModal'
import { StateContext } from '../context/StateContext'

const SellerAccountDetails: FC<any> = () => {
  const { adyenAccountHolder } = useContext(StateContext)

  if (!adyenAccountHolder?.accountHolderCode) return null

  return (
    <Columns spacing={1}>
      <Columns.Item>
        <Box>
          <Set orientation="vertical" spacing={3}>
            <Heading>Account Details</Heading>
            <Set spacing={8}>
              <Box>
                <Set orientation="vertical">
                  <Text variant="subtitle">Account Holder Code</Text>
                  <Text>{`${adyenAccountHolder.accountHolderCode}`}</Text>
                </Set>
              </Box>
              <Box>
                <Set orientation="vertical">
                  <Text variant="subtitle">Account Status</Text>
                  <Text>
                    {`${adyenAccountHolder.accountHolderStatus?.status || '-'}`}
                  </Text>
                </Set>
              </Box>
              <Box>
                <Set orientation="vertical">
                  <Text variant="subtitle">Account Email</Text>
                  <Text>
                    {`${adyenAccountHolder.accountHolderDetails?.email}`}
                  </Text>
                </Set>
              </Box>
            </Set>
          </Set>
          <Box csx={{ marginTop: 6 }}>
            <SellerCloseAccountModal adyenAccountHolder={adyenAccountHolder} />
          </Box>
        </Box>
      </Columns.Item>
    </Columns>
  )
}

export default SellerAccountDetails

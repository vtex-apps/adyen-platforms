import type { FC } from 'react'
import React from 'react'
import { Set, Columns, Heading, Text, Box } from '@vtex/admin-ui'

import SellerDeleteAccountModal from './sellerDeleteAccountModal'

const SellerAccountDetails: FC<any> = ({ seller }: any) => {
  if (!seller) return null

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
                  <Text>
                    {`${seller.adyenAccountHolder.accountHolderCode}`}
                  </Text>
                </Set>
              </Box>
              <Box>
                <Set orientation="vertical">
                  <Text variant="subtitle">Account Status</Text>
                  <Text>
                    {`${seller.adyenAccountHolder.accountHolderStatus.status}`}
                  </Text>
                </Set>
              </Box>
              <Box>
                <Set orientation="vertical">
                  <Text variant="subtitle">Account Email</Text>
                  <Text>
                    {`${seller.adyenAccountHolder.accountHolderDetails?.email}`}
                  </Text>
                </Set>
              </Box>
            </Set>
          </Set>
          <Box csx={{ marginTop: 6 }}>
            <SellerDeleteAccountModal seller={seller} />
          </Box>
        </Box>
      </Columns.Item>
    </Columns>
  )
}

export default SellerAccountDetails

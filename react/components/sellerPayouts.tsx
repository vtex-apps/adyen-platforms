import type { FC } from 'react'
import React, { useState } from 'react'
import { useMutation } from 'react-apollo'
import {
  Box,
  Set,
  Heading,
  useSelectState,
  Columns,
  Paragraph,
  Select,
  Button,
  toast,
} from '@vtex/admin-ui'

import UPDATE_ACCOUNT from '../graphql/UpdateAccount.graphql'

const SCHEDULE_OPTIONS = [
  {
    label: 'Daily',
    value: 'DAILY',
    description: 'Every day at midnight (00:00:00 CET).',
  },
  {
    label: 'Monthly',
    value: 'MONTHLY',
    description: 'Monthly at midnight (00:00:00 CET).',
  },
  {
    label: 'Weekly',
    value: 'WEEKLY',
    description: 'Weekly at midnight (00:00:00 CET).',
  },
  {
    label: 'Twice Weekly',
    value: 'WEEKLY_ON_TUE_FRI_MIDNIGHT',
    description: 'Weekly every Tuesday and Friday at midnight (00:00:00 CET).',
  },
  {
    label: 'Bimonthly',
    value: 'BIWEEKLY_ON_1ST_AND_15TH_AT_MIDNIGHT',
    description: 'Monthly on the 1st and 15th at midnight (00:00:00 CET).',
  },
  {
    label: 'Yearly',
    value: 'YEARLY',
    description: 'Every year on January 1st at midnight (00:00:00 CET).',
  },
]

const SellerPayouts: FC<any> = ({ seller }) => {
  const [isLoading, setIsLoading] = useState(false)

  const [updateAccount] = useMutation(UPDATE_ACCOUNT)
  const [account] = seller.adyenAccountHolder?.accounts || []
  const state = useSelectState({
    items: SCHEDULE_OPTIONS,
    itemToString: (item: any) => item.label,
    initialSelectedItem:
      SCHEDULE_OPTIONS.find(
        i => i.value === account?.payoutSchedule.schedule
      ) ?? SCHEDULE_OPTIONS[0],
  })

  return (
    <Columns spacing={1}>
      <Columns.Item>
        <Box>
          <Set orientation="vertical" spacing={3} fluid>
            <Heading>Payouts</Heading>
            <Paragraph csx={{ width: '60%' }}>
              Set seller payout schedule.
            </Paragraph>
            <Set spacing={3}>
              <Select
                items={SCHEDULE_OPTIONS}
                state={state}
                label="Schedule"
                renderItem={(item: any) => item.label}
              />
              <Paragraph csx={{ width: '60%' }}>
                {state.selectedItem?.description}
              </Paragraph>
            </Set>
          </Set>
        </Box>
        <Button
          loading={isLoading}
          disabled={!seller.adyenAccountHolder}
          variant="primary"
          csx={{ marginTop: '20px' }}
          onClick={async (_e: any) => {
            setIsLoading(true)

            try {
              await updateAccount({
                variables: {
                  accountCode: account.accountCode,
                  schedule: state.selectedItem?.value,
                },
              })
            } catch (err) {
              setIsLoading(false)

              toast.dispatch({
                type: 'error',
                message: 'Unable to update payout schedule',
              })

              return
            }

            setIsLoading(false)
            toast.dispatch({
              type: 'success',
              message: 'Payout schedule updated',
            })
          }}
        >
          Save
        </Button>
      </Columns.Item>
    </Columns>
  )
}

export default SellerPayouts

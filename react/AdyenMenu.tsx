import type { FC } from 'react'
import React from 'react'
import { useQuery } from 'react-apollo'
import {
  Columns,
  ThemeProvider,
  DataGrid,
  Tag,
  Heading,
  Text,
  useDataGridState,
  Skeleton,
  Tabs,
  Card,
  useTabState,
} from '@vtex/admin-ui'
import { useRuntime } from 'vtex.render-runtime'

import './styles.global.css'
import Settings from './components/Settings'
import Sellers from './graphql/Sellers.graphql'

const AdyenMenu: FC = () => {
  const { navigate } = useRuntime()
  const { loading, data } = useQuery(Sellers)

  const tabState = useTabState()

  const handleRowClick = (item: any) => {
    navigate({
      page: `admin.app.seller-detail`,
      params: { seller_id: item.id },
    })
  }

  const items: any[] = !loading && data ? data.sellers : []
  const gridState = useDataGridState({
    density: 'compact',
    onRowClick: (item: any) => handleRowClick(item),
    columns: [
      {
        id: 'account',
        header: 'Account',
      },
      {
        id: 'name',
        header: 'Name',
      },
      // {
      //   id: 'payoutDate',
      //   header: 'Next Payout',
      // },
      // {
      //   id: 'balance',
      //   header: 'Balance',
      // },
      {
        id: 'status',
        header: 'Status',
        resolver: {
          type: 'root',
          render: function Description({ item, context }) {
            if (context.status === 'loading') {
              return <Skeleton csx={{ height: 24 }} />
            }

            return (
              <Tag
                size="small"
                palette={
                  item?.adyenAccount?.status === 'Active' ? 'green' : undefined
                }
                label={
                  !item.adyenAccount ? 'No Account' : item.adyenAccount.status
                }
              />
            )
          },
        },
      },
    ],
    items,
  })

  if (gridState.status !== 'loading' && !data && loading) {
    gridState.setStatus({
      type: 'loading',
    })
  }

  if (gridState.status === 'loading' && !loading) {
    gridState.setStatus({
      type: 'ready',
    })
  }

  return (
    <ThemeProvider>
      <Columns
        csx={{
          padding: 80,
        }}
      >
        <Columns.Item>
          <Heading>Adyen for Platforms</Heading>
          <Tabs state={tabState}>
            <Tabs.List csx={{ marginTop: 6 }} aria-label="behavior-tabs">
              <Tabs.Tab label="Sellers" id="1" />
              <Tabs.Tab label="Settings" id="2" />
            </Tabs.List>
            <Tabs.Content id="1">
              <Card csx={{ marginTop: 2 }}>
                <Text variant="subtitle" csx={{ marginBottom: 9 }}>
                  Manage Adyen account onboarding and payouts for your connected
                  seller accounts
                </Text>
                <DataGrid state={gridState} />
              </Card>
            </Tabs.Content>
            <Tabs.Content id="2">
              <Settings />
            </Tabs.Content>
          </Tabs>
        </Columns.Item>
      </Columns>
    </ThemeProvider>
  )
}

export default AdyenMenu

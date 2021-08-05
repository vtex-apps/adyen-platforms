import type { FC } from 'react'
import React from 'react'
import { ThemeProvider, Card, Divider, PageHeader } from '@vtex/admin-ui'
import { useQuery } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'

import Seller from './graphql/Seller.graphql'
import './styles.global.css'
import SellerDetailTitle from './components/sellerDetailTitle'
import SellerPayouts from './components/sellerPayouts'
import SellerOnboarding from './components/sellerOnboarding'

const SellerDetail: FC = () => {
  const {
    route: { params },
    navigate,
  } = useRuntime()

  const { loading, data } = useQuery(Seller, {
    variables: { sellerId: params.seller_id },
  })

  if (loading || !data) return null

  return (
    <ThemeProvider>
      <Card
        csx={{
          padding: 60,
          height: '100%',
        }}
      >
        <PageHeader
          csx={{ marginBottom: '20px' }}
          onPopNavigation={() =>
            navigate({
              page: `admin.app.adyen-menu`,
            })
          }
        >
          <PageHeader.Title>Seller Detail</PageHeader.Title>
        </PageHeader>
        <SellerDetailTitle seller={data.seller} />
        <Divider csx={{ marginY: 6 }} />
        <SellerOnboarding data={data} />
        <Divider csx={{ marginY: 6 }} />
        <SellerPayouts seller={data.seller} />
      </Card>
    </ThemeProvider>
  )
}

export default SellerDetail

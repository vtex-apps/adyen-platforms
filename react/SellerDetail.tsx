import type { FC } from 'react'
import React from 'react'
import { ThemeProvider, Card, Divider } from '@vtex/admin-ui'
import { useQuery } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'

import Seller from './graphql/Seller.graphql'
import './styles.global.css'
import SellerDetailTitle from './components/sellerDetailTitle'
import SellerPayouts from './components/sellerPayouts'
import SellerOnboarding from './components/sellerOnboarding'
import SellerAccountDetails from './components/sellerAccountDetails'

const SellerDetail: FC = () => {
  const {
    route: { params },
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
        <SellerDetailTitle seller={data.seller} />
        <SellerOnboarding data={data} />
        <Divider csx={{ marginY: 6 }} />
        <SellerPayouts seller={data.seller} />
        <Divider csx={{ marginY: 6 }} />
        <SellerAccountDetails seller={data.seller} />
      </Card>
    </ThemeProvider>
  )
}

export default SellerDetail

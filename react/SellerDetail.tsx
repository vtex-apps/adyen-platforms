import { FC, useState } from 'react'
import React from 'react'
import { ThemeProvider, Card, Divider } from '@vtex/admin-ui'
import { useQuery } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'

import Seller from './graphql/Seller.graphql'
import Onboarding from './graphql/Onboarding.graphql'
import AdyenAccountHolder from './graphql/AdyenAccountHolder.graphql'
import SellerDetailTitle from './components/sellerDetailTitle'
import SellerPayouts from './components/sellerPayouts'
import SellerOnboarding from './components/sellerOnboarding'
import SellerAccountDetails from './components/sellerAccountDetails'
import { StateContext } from './context/StateContext'

import './styles.global.css'

const SellerDetail: FC = () => {
  const {
    route: { params },
  } = useRuntime()

  const [state, setState] = useState<any>({
    onboarding: null,
    seller: null,
    adyenAccountHolder: null,
  })

  const { loading: loadingS, data: sellerData } = useQuery(Seller, {
    variables: { sellerId: params.seller_id },
    onCompleted: () => {
      setState((state: any) => ({
        ...state,
        seller: sellerData.seller
      }))
    }
  })

  const { loading: loadingA, data: adyenData } = useQuery(AdyenAccountHolder, {
    variables: { sellerId: params.seller_id },
    onCompleted: () => {
      setState((state: any) => ({
        ...state,
        adyenAccountHolder: adyenData.adyenAccountHolder
      }))
    }
  })

  const { accountHolderCode } = adyenData?.adyenAccountHolder || {}
  const { loading: loadingO, data: onboardingData } = useQuery(Onboarding, {
    variables: {
      accountHolderCode,
    },
    skip: !accountHolderCode,
    onCompleted: () => {
      setState((state: any) => ({
        ...state,
        onboarding: onboardingData.onboarding
      }))
    }
  })

  const isLoading = loadingS && loadingO && loadingA

  if (isLoading || !sellerData) return null

  console.log('state ==>', state)

  return (
    <ThemeProvider>
      <StateContext.Provider value={state}>
        <Card
          csx={{
            padding: 60,
            height: '100%',
          }}
        >
          <SellerDetailTitle />
          <SellerOnboarding />
          <Divider csx={{ marginY: 6 }} />
          <SellerPayouts />
          <Divider csx={{ marginY: 6 }} />
          <SellerAccountDetails />
        </Card>
      </StateContext.Provider>
    </ThemeProvider>
  )
}

export default SellerDetail

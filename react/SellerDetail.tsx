import type { FC } from 'react'
import React, { useReducer } from 'react'
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

const initialState = {
  onboarding: null,
  seller: null,
  adyenAccountHolder: null,
}

function reducer(state: any, action: any) {
  const { adyenAccountHolder, seller, onboarding } = action

  switch (action.type) {
    case 'SET_ONBOARDING':
      return { ...state, onboarding }

    case 'SET_SELLER':
      return { ...state, seller }

    case 'SET_ADYEN':
      return { ...state, adyenAccountHolder }

    case 'CREATE_ADYEN_ACCOUNT':
      return { ...state, adyenAccountHolder, onboarding }

    default:
      return state
  }
}

const SellerDetail: FC = () => {
  const {
    route: { params },
  } = useRuntime()

  const [state, dispatch] = useReducer(reducer, initialState)
  const { loading: loadingS, data: sellerData } = useQuery(Seller, {
    variables: { sellerId: params.seller_id },
  })

  const { loading: loadingA, data: adyenData } = useQuery(AdyenAccountHolder, {
    variables: { sellerId: params.seller_id },
  })

  const { accountHolderCode } = adyenData?.adyenAccountHolder || {}
  const { loading: loadingO, data: onboardingData } = useQuery(Onboarding, {
    variables: {
      accountHolderCode,
    },
    skip: !accountHolderCode,
  })

  const isLoading = loadingS && loadingO && loadingA

  if (isLoading || !sellerData) return null

  if (sellerData && !state.seller) {
    dispatch({ type: 'SET_SELLER', seller: sellerData.seller })
  }

  if (adyenData && !state.adyenAccountHolder) {
    dispatch({
      type: 'SET_ADYEN',
      adyenAccountHolder: adyenData.adyenAccountHolder,
    })
  }

  if (onboardingData && !state.onboarding) {
    dispatch({ type: 'SET_ONBOARDING', onboarding: onboardingData.onboarding })
  }

  console.log('state ==>', state)

  return (
    <ThemeProvider>
      <StateContext.Provider value={{ ...state, dispatch }}>
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

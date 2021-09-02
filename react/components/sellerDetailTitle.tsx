import type { FC } from 'react'
import React, { useContext } from 'react'
import { PageHeader } from '@vtex/admin-ui'
import { useRuntime } from 'vtex.render-runtime'

import { StateContext } from '../context/StateContext'

const SellerDetailTitle: FC<any> = () => {
  const { navigate } = useRuntime()
  const { seller } = useContext(StateContext)

  if (!seller) return null

  return (
    <PageHeader
      csx={{ marginBottom: '20px' }}
      onPopNavigation={() =>
        navigate({
          page: `admin.app.adyen-menu`,
        })
      }
    >
      <PageHeader.Title>{seller.name}</PageHeader.Title>
    </PageHeader>
  )
}

export default SellerDetailTitle

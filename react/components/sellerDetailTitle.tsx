import type { FC } from 'react'
import React from 'react'
import { PageHeader } from '@vtex/admin-ui'
import { useRuntime } from 'vtex.render-runtime'

const SellerDetailTitle: FC<any> = ({ seller }: any) => {
  const { navigate } = useRuntime()

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

import type { FC } from 'react'
import React, { useEffect } from 'react'
import { useMutation } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'
import { PageBlock, Layout, PageHeader } from 'vtex.styleguide'

import OnboardingComplete from './graphql/OnboardingComplete.graphql'

const OnboardSuccess: FC = () => {
  const [updateOnboarding] = useMutation(OnboardingComplete)
  const {
    route: { queryString },
  } = useRuntime()

  useEffect(() => {
    if (!queryString?.account) return

    updateOnboarding({
      variables: { accountHolderCode: queryString.account },
    })
  }, [queryString?.account, updateOnboarding])

  return (
    <Layout pageHeader={<PageHeader title="Adyen Onboarding" />}>
      <PageBlock>
        <div className="mb4">Adyen onboarding is complete.</div>

        <div>
          Once Adyen has finished with the verification process, payouts on your
          account will be enabled.
        </div>
      </PageBlock>
    </Layout>
  )
}

export default OnboardSuccess

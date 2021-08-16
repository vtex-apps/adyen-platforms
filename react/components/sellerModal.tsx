/* eslint-disable import/order */
import React, { useState } from 'react'
import type { FC } from 'react'

import {
  Box,
  Set,
  Text,
  Select,
  ModalDisclosure,
  Button,
  StatelessModal,
  ModalButton,
  Input,
  toast,
  useModalState,
  useSelectState,
} from '@vtex/admin-ui'
import { useMutation } from 'react-apollo'

import CREATE_ACCOUNT_HOLDER from '../graphql/CreateAccountHolder.graphql'

const SellerModal: FC<any> = ({ data, setOnboardToken, disabled }) => {
  const [legalBusinessName, setLegalBusinessName] = useState('')
  const [email, setEmail] = useState('')
  const [accountHolderCode, setAccountHolderCode] = useState(data.seller.id)
  const [isLoading, setIsLoading] = useState(false)
  const [createAccountHolder] = useMutation(CREATE_ACCOUNT_HOLDER)
  const publishModal = useModalState()

  const countries = [{ id: 'US', label: 'United States' }]
  const legalEntities = [{ id: 'Business', label: 'Business' }]

  const countryState = useSelectState({
    items: countries,
    itemToString: (item: any) => item.label,
    initialSelectedItem: countries[0],
  })

  const legalEntityState = useSelectState({
    items: legalEntities,
    itemToString: (item: any) => item.label,
    initialSelectedItem: legalEntities[0],
  })

  return (
    <Set spacing={3}>
      <ModalDisclosure state={publishModal}>
        <Button
          disabled={disabled || data?.seller?.adyenOnboarding?.onboardComplete}
          variant="primary"
        >
          Create Adyen Account
        </Button>
      </ModalDisclosure>
      <StatelessModal
        aria-label="Create Adyen account modal"
        state={publishModal}
        size="regular"
        hideOnClickOutside={false}
      >
        <StatelessModal.Header title="Create Adyen Account" />
        <StatelessModal.Content>
          <Text>
            Enter the required information to create an Adyen account for the
            seller.
          </Text>
          <Box csx={{ marginTop: '15px', marginBottom: '15px' }}>
            <Input
              id="accountHolderCode"
              label="Adyen Account Holder Code"
              helperText="A unique identifier used in the Adyen dashboard"
              value={accountHolderCode}
              onChange={e => setAccountHolderCode(e.target.value)}
            />
          </Box>
          <Set orientation="vertical" spacing={1}>
            <Select
              block
              items={countries}
              state={countryState}
              label="Country"
              renderItem={(item: any) => item.label}
            />
            <Select
              block
              items={legalEntities}
              state={legalEntityState}
              label="Legal Entity Type"
              renderItem={(item: any) => item.label}
            />
          </Set>
          <Input
            id="legalBusinessName"
            label="Legal Business Name"
            value={legalBusinessName}
            onChange={e => setLegalBusinessName(e.target.value)}
          />
          <Input
            id="email"
            type="email"
            label="Business Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </StatelessModal.Content>
        <StatelessModal.Footer>
          <ModalButton closeModalOnClick variant="secondary">
            Cancel
          </ModalButton>
          <ModalButton
            loading={isLoading}
            disabled={isLoading}
            onClick={async () => {
              setIsLoading(true)

              try {
                const accountHolder = await createAccountHolder({
                  variables: {
                    accountHolderCode,
                    sellerId: data.seller.id,
                    country: countryState.selectedItem?.id,
                    legalBusinessName,
                    email,
                    legalEntity: legalEntityState.selectedItem?.id,
                  },
                })

                setOnboardToken(accountHolder.data.createAccountHolder.urlToken)
              } catch (error) {
                console.log(error)
                setIsLoading(false)

                return
              }

              toast.dispatch({
                type: 'success',
                message: 'Adyen account created',
              })

              setIsLoading(false)
              publishModal.hide()
            }}
          >
            Create
          </ModalButton>
        </StatelessModal.Footer>
      </StatelessModal>
    </Set>
  )
}

export default SellerModal

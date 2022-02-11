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
  Alert,
  IconErrorColorful,
} from '@vtex/admin-ui'
import { useMutation } from 'react-apollo'

import CREATE_ACCOUNT_HOLDER from '../graphql/CreateAccountHolder.graphql'

const SellerOnboardingModal: FC<any> = ({ seller, dispatch, disabled }) => {
  const [legalBusinessName, setLegalBusinessName] = useState('')
  const [email, setEmail] = useState('')
  const [accountHolderCode, setAccountHolderCode] = useState(seller?.id)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<any[]>([])
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

  const createAccount = async () => {
    setErrors([])
    setIsLoading(true)
    let response = null

    try {
      response = await createAccountHolder({
        variables: {
          accountHolderCode,
          sellerId: seller.id,
          country: countryState.selectedItem?.id,
          legalBusinessName,
          email,
          legalEntity: legalEntityState.selectedItem?.id,
        },
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
    }

    setIsLoading(false)

    if (!response?.data) {
      return setErrors([{ errorDescription: 'Adyen account creation failed' }])
    }

    const { invalidFields, onboarding, adyenAccountHolder } =
      response.data.createAccountHolder

    if (invalidFields) {
      return setErrors(invalidFields)
    }

    dispatch({
      type: 'CREATE_ADYEN_ACCOUNT',
      onboarding,
      adyenAccountHolder,
    })

    toast.dispatch({
      type: 'success',
      message: 'Adyen account created',
    })

    publishModal.hide()
  }

  return (
    <Set spacing={3}>
      <ModalDisclosure state={publishModal}>
        <Button disabled={disabled} variant="primary">
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
          {errors.length > 0 && (
            <Alert
              csx={{ marginTop: '15px' }}
              type="error"
              icon={<IconErrorColorful />}
              visible={errors.length > 0}
            >
              {errors.map((error, i) => (
                <div key={i}>{error.errorDescription}</div>
              ))}
            </Alert>
          )}
        </StatelessModal.Content>
        <StatelessModal.Footer>
          <ModalButton
            onClick={() => setErrors([])}
            closeModalOnClick
            variant="secondary"
          >
            Cancel
          </ModalButton>
          <ModalButton
            loading={isLoading}
            disabled={isLoading}
            onClick={async () => createAccount()}
          >
            Create
          </ModalButton>
        </StatelessModal.Footer>
      </StatelessModal>
    </Set>
  )
}

export default SellerOnboardingModal

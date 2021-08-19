/* eslint-disable import/order */
import React, { useState } from 'react'
import type { FC } from 'react'

import {
  Set,
  Text,
  ModalDisclosure,
  Button,
  StatelessModal,
  ModalButton,
  toast,
  useModalState,
  Alert,
  IconWarningColorful,
} from '@vtex/admin-ui'
import { useMutation } from 'react-apollo'

import DELETE_ACCOUNT_HOLDER from '../graphql/DeleteAccountHolder.graphql'

const SellerDeleteAccountModal: FC<any> = ({ seller }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [deleteAccountHolder] = useMutation(DELETE_ACCOUNT_HOLDER)
  const publishModal = useModalState()

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      console.log(seller.adyenAccountHolder.accountHolderCode)
      await deleteAccountHolder({
        variables: {
          accountHolderCode: seller.adyenAccountHolder.accountHolderCode,
        },
      })
    } catch (error) {
      console.log(error)
    }

    setIsLoading(false)

    toast.dispatch({
      type: 'success',
      message: 'Adyen account deleted',
    })

    publishModal.hide()
  }

  return (
    <Set spacing={3}>
      <ModalDisclosure state={publishModal}>
        <Button
          disabled={
            seller.adyenAccountHolder.accountHolderStatus.status === 'Closed'
          }
          variant="danger"
        >
          Delete Account
        </Button>
      </ModalDisclosure>
      <StatelessModal
        aria-label="Delete Adyen account modal"
        state={publishModal}
        size="regular"
        hideOnClickOutside={false}
      >
        <StatelessModal.Header title="Delete Adyen Account" />
        <StatelessModal.Content>
          <Text>Delete the Adyen account associated with this seller.</Text>
          <Alert
            csx={{ marginTop: 6 }}
            type="warning"
            icon={<IconWarningColorful />}
            visible
          >
            This action cannot be undone. This account will no longer be able to
            process payments or receive payouts.
          </Alert>
        </StatelessModal.Content>
        <StatelessModal.Footer>
          <ModalButton closeModalOnClick variant="secondary">
            Cancel
          </ModalButton>
          <ModalButton
            loading={isLoading}
            disabled={isLoading}
            onClick={async () => handleDelete()}
          >
            Create
          </ModalButton>
        </StatelessModal.Footer>
      </StatelessModal>
    </Set>
  )
}

export default SellerDeleteAccountModal

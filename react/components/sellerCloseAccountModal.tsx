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

import CLOSE_ACCOUNT_HOLDER from '../graphql/CloseAccountHolder.graphql'

const SellerCloseAccountModal: FC<any> = ({ adyenAccountHolder }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [deleteAccountHolder] = useMutation(CLOSE_ACCOUNT_HOLDER)
  const publishModal = useModalState()

  const handleClose = async () => {
    setIsLoading(true)
    try {
      await deleteAccountHolder({
        variables: {
          accountHolderCode: adyenAccountHolder.accountHolderCode,
        },
      })
    } catch (error) {
      console.error(error)
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
          disabled={adyenAccountHolder.accountHolderStatus?.status === 'Closed'}
          variant="danger"
        >
          Close Account
        </Button>
      </ModalDisclosure>
      <StatelessModal
        aria-label="Close Adyen account modal"
        state={publishModal}
        size="regular"
        hideOnClickOutside={false}
      >
        <StatelessModal.Header title="Close Adyen Account" />
        <StatelessModal.Content>
          <Text>Close the Adyen account associated with this seller.</Text>
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
            variant="danger"
            onClick={async () => handleClose()}
          >
            Close
          </ModalButton>
        </StatelessModal.Footer>
      </StatelessModal>
    </Set>
  )
}

export default SellerCloseAccountModal

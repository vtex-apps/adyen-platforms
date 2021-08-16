interface CreateAccountHolderRequest {
  accountHolderCode: string
  accountHolderDetails: AccountHolderDetails
  legalEntity: string
}

interface GetAccountHolderResponse {
  accountHolderCode: string
  accountHolderDetails: AccountHolderDetails
  accountHolderStatus: AccountHolderStatus
  legalEntity: string
  verification: {
    accountHolder: {
      checks: Check[]
    }
  }
}

interface GetOnboardingUrlRequest {
  accountHolderCode: string
}

interface GetOnboardingUrlResponse {
  invalidFields: InvalidField[]
  pspReference: string
  resultCode: string
  redirectUrl: string
}

interface AccountHolderDetails {
  address: Address
  businessDetails: BusinessDetails
  email: string
}

interface Address {
  country: string
}

interface BusinessDetails {
  legalBusinessName: string
}

interface CreateAccountHolderResponse {
  invalidFields: string[]
  pspReference: string
  accountCode: string
  accountHolderCode: string
  accountHolderDetails: AccountHolderDetails
  accountHolderStatus: AccountHolderStatus
  legalEntity: string
  verification: {
    accountHolder: {
      checks: Check[]
    }
  }
}

interface AccountHolderStatus {
  status: 'Active' | 'Inactive' | 'Suspended' | 'Closed'
  processingState: {
    disabled: boolean
    processedFrom: {
      currency: string
      value: number
    }
    processedTo: {
      currency: string
      value: number
    }
    tierNumber: number
  }
  payoutState: {
    allowPayout: boolean
    disabled: boolean
  }
  events: Event[]
}

interface Event {
  event: string
  executionDate: string
  reason: string
}

interface Check {
  type: string
  status: string
  requiredFields?: string[]
}

interface InvalidField {
  errorCode: string
  errorDescription: string
  fieldType: {
    field: string
    fieldName: string
    shareholderCode: string
  }
}

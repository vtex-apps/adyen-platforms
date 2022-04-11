import { service } from '../../services'

export interface CreateAccountHolderDTO {
  accountHolderCode: string
  sellerId: string
  country: string
  legalBusinessName: string
  email: string
  legalEntity: string
  processingTier: number
}

export interface AccountUpdateDTO {
  accountCode: string
  schedule: string
}

export const adyenMutations = {
  createAccountHolder: async (
    _: unknown,
    data: CreateAccountHolderDTO,
    ctx: Context
  ) => {
    return service.adyen.createAccountHolder({ ctx, data })
  },
  closeAccountHolder: async (
    _: unknown,
    data: { accountHolderCode: string },
    ctx: Context
  ) => {
    return service.adyen.closeAccountHolder({ ctx, data })
  },
  updateAccount: async (_: unknown, data: AccountUpdateDTO, ctx: Context) => {
    return service.adyen.updateAccount({ ctx, data })
  },
}

export const adyenQueries = {
  adyenAccountHolder: async (
    _: unknown,
    data: { sellerId: string },
    ctx: Context
  ) => {
    return service.adyen.getAccountHolder({ ctx, data })
  },
}

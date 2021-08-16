import { service } from '../../services'

export interface CreateAccountHolderDTO {
  accountHolderCode: string
  sellerId: string
  country: string
  legalBusinessName: string
  email: string
  legalEntity: string
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
    return service.account.createAccountHolder({ ctx, data })
  },
  updateAccount: async (_: unknown, data: AccountUpdateDTO, ctx: Context) => {
    return service.account.updateAccount({ ctx, data })
  },
}

export const adyenQueries = {
  getAccountHolder: async (
    _: unknown,
    data: { accountHolderCode: string },
    ctx: Context
  ) => {
    return service.account.getAccountHolder({ ctx, data })
  },
}

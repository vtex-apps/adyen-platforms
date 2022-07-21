import { MasterData } from '@vtex/api'

const DATA_ENTITY = 'account'
const ACCOUNT_SCHEMA_VERSION = 'account-dev@0.1'
const ACCOUNT_SCHEMA = {
  properties: {
    sellerId: {
      type: 'string',
    },
    accountHolderCode: {
      type: 'string',
    },
    accountCode: {
      type: 'string',
      unique: true,
    },
    status: {
      type: 'string',
    },
  },
  'v-default-fields': [
    'id',
    'sellerId',
    'accountHolderCode',
    'accountCode',
    'status',
  ],
  required: ['sellerId', 'accountHolderCode', 'accountCode', 'status'],
  'v-indexed': ['sellerId', 'accountHolderCode'],
  'v-cache': false,
  'v-security': {
    allowGetAll: true,
    publicRead: ['sellerId', 'accountHolderCode', 'accountCode', 'status'],
  },
}

interface IAdyenAccount {
  id: string
  sellerId: string
  accountHolderCode: string
  accountCode: string
  status: string
}

export class Account extends MasterData {
  private checkSchema = async () => {
    return this.createOrUpdateSchema({
      dataEntity: DATA_ENTITY,
      schemaName: ACCOUNT_SCHEMA_VERSION,
      schemaBody: ACCOUNT_SCHEMA,
    }).catch(() => null)
  }

  public async save({
    data,
  }: {
    data: {
      sellerId: string
      accountHolderCode: string
      accountCode: string
      status: string
    }
  }) {
    await this.checkSchema()

    return this.createDocument({
      dataEntity: DATA_ENTITY,
      fields: data,
      schema: ACCOUNT_SCHEMA_VERSION,
    })
  }

  public async update(
    id: string,
    data: { [key: string]: string | boolean | number | null }
  ) {
    await this.checkSchema()

    return this.updatePartialDocument({
      id,
      dataEntity: DATA_ENTITY,
      fields: data,
      schema: ACCOUNT_SCHEMA_VERSION,
    })
  }

  public async find(data: { [key: string]: string }) {
    const [key] = Object.keys(data)

    return this.searchDocuments<IAdyenAccount>({
      dataEntity: DATA_ENTITY,
      fields: ['id', 'sellerId', 'accountHolderCode', 'accountCode', 'status'],
      pagination: { page: 1, pageSize: 100 },
      where: `${key}=${data[key]}`,
      schema: ACCOUNT_SCHEMA_VERSION,
    })
  }

  public async findBySellerId(data: string[]) {
    const where = `sellerId=${data.join(' OR sellerId=')}`

    return this.searchDocuments<IAdyenAccount>({
      dataEntity: DATA_ENTITY,
      fields: ['sellerId', 'accountHolderCode', 'accountCode', 'status'],
      pagination: { page: 1, pageSize: 100 },
      where,
      schema: ACCOUNT_SCHEMA_VERSION,
    })
  }

  public async all() {
    return this.searchDocumentsWithPaginationInfo<IAdyenAccount>({
      dataEntity: DATA_ENTITY,
      fields: ['sellerId', 'accountHolderCode', 'accountCode', 'status'],
      pagination: { page: 1, pageSize: 100 },
      schema: ACCOUNT_SCHEMA_VERSION,
    })
  }
}

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

export class Account extends MasterData {
  private checkSchema = async () => {
    try {
      return await this.createOrUpdateSchema({
        dataEntity: DATA_ENTITY,
        schemaName: ACCOUNT_SCHEMA_VERSION,
        schemaBody: ACCOUNT_SCHEMA,
      })
    } catch (_err) {
      return null
    }
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
    })
  }

  public async find(data: { [key: string]: string }) {
    try {
      const [key] = Object.keys(data)

      const accounts = await this.searchDocuments<IAdyenAccount>({
        dataEntity: DATA_ENTITY,
        fields: ['sellerId', 'accountHolderCode', 'accountCode', 'status'],
        pagination: { page: 1, pageSize: 100 },
        where: `${key}=${data[key]}`,
        schema: ACCOUNT_SCHEMA_VERSION,
      })

      return accounts[0] || null
    } catch (error) {
      return null
    }
  }

  public async findBySellerId(data: string[]) {
    const where = `sellerId=${data.join(' OR sellerId=')}`

    try {
      const accounts = await this.searchDocuments<IAdyenAccount>({
        dataEntity: DATA_ENTITY,
        fields: ['sellerId', 'accountHolderCode', 'accountCode', 'status'],
        pagination: { page: 1, pageSize: 100 },
        where,
        schema: ACCOUNT_SCHEMA_VERSION,
      })

      return accounts || null
    } catch (error) {
      return null
    }
  }

  public async all() {
    try {
      const accounts =
        await this.searchDocumentsWithPaginationInfo<IAdyenAccount>({
          dataEntity: DATA_ENTITY,
          fields: ['sellerId', 'accountHolderCode', 'accountCode', 'status'],
          pagination: { page: 1, pageSize: 100 },
        })

      return accounts.data
    } catch (error) {
      return []
    }
  }
}

interface IAdyenAccount {
  sellerId: string
  accountHolderCode: string
  accountCode: string
  status: string
}

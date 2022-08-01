import { MasterData } from '@vtex/api'

const DATA_ENTITY = 'onboarding'
const ONBOARDING_SCHEMA_VERSION = 'onboarding-dev@0.1'
const ONBOARDING_SCHEMA = {
  properties: {
    accountHolderCode: {
      type: 'string',
      unique: true,
    },
    urlToken: {
      type: ['null', 'string'],
      unique: true,
    },
    expirationTimestamp: {
      type: ['null', 'number'],
    },
  },
  'v-default-fields': [
    'id',
    'accountHolderCode',
    'urlToken',
    'expirationTimestamp',
  ],
  required: ['accountHolderCode', 'urlToken', 'expirationTimestamp'],
  'v-indexed': ['accountHolderCode', 'urlToken'],
  'v-cache': false,
  'v-security': {
    allowGetAll: true,
    publicRead: ['accountHolderCode', 'urlToken', 'expirationTimestamp'],
  },
}

interface Ionboarding {
  id: string
  accountHolderCode: string
  urlToken: string
  expirationTimestamp: number
}

export class Onboarding extends MasterData {
  private checkSchema = async () => {
    return this.createOrUpdateSchema({
      dataEntity: DATA_ENTITY,
      schemaName: ONBOARDING_SCHEMA_VERSION,
      schemaBody: ONBOARDING_SCHEMA,
    }).catch(() => null)
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
      schema: ONBOARDING_SCHEMA_VERSION,
    })
  }

  public async create({
    data,
  }: {
    data: {
      accountHolderCode: string
      urlToken: string
      expirationTimestamp: number
    }
  }) {
    await this.checkSchema()

    return this.createDocument({
      dataEntity: DATA_ENTITY,
      fields: data,
    })
  }

  public async find(data: { [key: string]: string }) {
    const [key] = Object.keys(data)

    return this.searchDocuments<Ionboarding>({
      dataEntity: DATA_ENTITY,
      fields: ['id', 'accountHolderCode', 'urlToken', 'expirationTimestamp'],
      pagination: { page: 1, pageSize: 100 },
      schema: ONBOARDING_SCHEMA_VERSION,
      where: `${key}=${data[key]}`,
    })
  }
}

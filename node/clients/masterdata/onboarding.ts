import { MasterData } from '@vtex/api'

const DATA_ENTITY = 'onboarding'
const ONBOARDING_SCHEMA_VERSION = 'onboarding-dev@0.1'
const ONBOARDING_SCHEMA = {
  properties: {
    accountHolderCode: {
      type: 'string',
      unique: true,
    },
    onboardComplete: {
      type: 'boolean',
    },
    urlToken: {
      type: 'string',
      unique: true,
    },
  },
  'v-default-fields': [
    'id',
    'accountHolderCode',
    'onboardComplete',
    'urlToken',
  ],
  required: ['accountHolderCode', 'onboardComplete', 'urlToken'],
  'v-indexed': ['accountHolderCode', 'urlToken'],
  'v-cache': false,
  'v-security': {
    allowGetAll: true,
    publicRead: ['accountHolderCode', 'onboardComplete', 'urlToken'],
  },
}

export class Onboarding extends MasterData {
  private checkSchema = async () => {
    try {
      return await this.createOrUpdateSchema({
        dataEntity: DATA_ENTITY,
        schemaName: ONBOARDING_SCHEMA_VERSION,
        schemaBody: ONBOARDING_SCHEMA,
      })
    } catch (_err) {
      return null
    }
  }

  public async create({
    data,
  }: {
    data: {
      accountHolderCode: string
      onboardComplete: boolean
      urlToken: string
    }
  }) {
    await this.checkSchema()

    try {
      return this.createDocument({
        dataEntity: DATA_ENTITY,
        fields: data,
      })
    } catch (err) {
      return null
    }
  }

  public async find(data: { [key: string]: string }) {
    const [key] = Object.keys(data)

    try {
      const response = await this.searchDocuments<IOnboarding>({
        dataEntity: DATA_ENTITY,
        fields: ['accountHolderCode', 'onboardComplete', 'urlToken'],
        pagination: { page: 1, pageSize: 100 },
        schema: ONBOARDING_SCHEMA_VERSION,
        where: `${key}=${data[key]}`,
      })

      return response[0] || null
    } catch (err) {
      return null
    }
  }
}

interface IOnboarding {
  accountHolderCode: string
  onboardComplete: boolean
  urlToken: string
}

export const accountSchemaVersion = 'v0.0'

export const accountSchema = {
  properties: {
    name: {
      type: 'string',
    },
  },
  'v-default-fields': ['id', 'name'],
  required: ['name'],
  'v-indexed': ['name'],
  'v-cache': false,
  'v-security': {
    allowGetAll: true,
    publicRead: ['name'],
  },
}

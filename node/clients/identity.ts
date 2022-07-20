import { JanusClient } from '@vtex/api'
import type { IOContext, InstanceOptions } from '@vtex/api'

export default class IdentityClient extends JanusClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
      headers: {
        ...options?.headers,
      },
    })
  }

  public async validateToken(token: string): Promise<any> {
    return this.http.post(`/api/vtexid/credential/validate`, { token })
  }
}

import http from '@/lib/http'
import { AccountResType } from './../../server/src/schemaValidations/account.schema'
import { UpdateMeBodyType } from '@/schemaValidations/account.schema'

const accountApiRequest = {
  me: (sessionToken: string) =>
    http.get<AccountResType>('account/me', {
      headers: {
        Authorization: `Bearer ${sessionToken}`
      }
    }),
  meClient: () => http.get<AccountResType>('account/me'),
  updateMe: (body: UpdateMeBodyType) => http.put<AccountResType>('account/me', body)
}

export default accountApiRequest

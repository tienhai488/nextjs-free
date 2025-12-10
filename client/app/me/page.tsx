import accountApiRequest from '@/apiRequests/account'
import { cookies } from 'next/headers'

export default async function MePage() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('sessionToken')?.value || ''

  const result = await accountApiRequest.me(sessionToken)

  return (
    <div>
      <h1>Profile</h1>
      <div>Hi, {result.payload.data.name}</div>
      {/* <Profile /> */}
    </div>
  )
}

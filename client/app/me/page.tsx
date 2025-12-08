import Profile from '@/app/me/profile'
import envConfig from '@/config'
import { cookies } from 'next/headers'

export default async function MePage() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('sessionToken')?.value || ''

  const res = await fetch(envConfig.NEXT_PUBLIC_API_ENDPOINT + '/account/me', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionToken}`
    }
  })

  const data = await res.json()

  return (
    <div>
      <h1>Profile</h1>
      <div>Hi, {data?.data?.name}</div>
      <Profile />
    </div>
  )
}

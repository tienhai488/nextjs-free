'use client'

import authApiRequest from '@/apiRequests/auth'
import { clientSessionToken } from '@/lib/http'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function LogoutPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const sessionToken = searchParams.get('sessionToken')

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    if (sessionToken === clientSessionToken.value) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      authApiRequest.logoutFromNextClientToNextServer(true, signal).then((res) => {
        router.push(`/login?redirectFrom=${pathname}`)
      })
    }

    return () => controller.abort()
  }, [pathname, router, sessionToken])

  return <div>Logging out...</div>
}

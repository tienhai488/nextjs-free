'use client'

import authApiRequest from '@/apiRequests/auth'
import { Button } from '@/components/ui/button'
import { clientSessionToken } from '@/lib/http'
import { useEffect } from 'react'

export default function SlideSession() {
  useEffect(() => {
    const interval = setInterval(async () => {
      const now = new Date()
      const expiresAt = new Date(clientSessionToken.expiresAt)

      if (expiresAt.getTime() - now.getTime() <= 60 * 60 * 1000) {
        const res = await authApiRequest.slideSessionFromNextClientToNextServer()

        clientSessionToken.value = (res.payload as any).payload.data.token
        clientSessionToken.expiresAt = (res.payload as any).payload.data.expiresAt
      }
    }, 30 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  const slideSession = async () => {
    const res = await authApiRequest.slideSessionFromNextClientToNextServer()

    clientSessionToken.value = (res.payload as any).payload.data.token
    clientSessionToken.expiresAt = (res.payload as any).payload.data.expiresAt
  }
  return <Button onClick={slideSession}>Slide session</Button>
}

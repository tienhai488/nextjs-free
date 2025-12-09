'use client'

import accountApiRequest from '@/apiRequests/account'
import { useEffect } from 'react'

export default function Profile() {
  useEffect(() => {
    const fetchRequest = async () => {
      const result = await accountApiRequest.meClient()
      console.log('result client', result)
    }

    fetchRequest()
  }, [])
  return <div>Profile</div>
}

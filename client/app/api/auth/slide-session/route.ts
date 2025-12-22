import authApiRequest from '@/apiRequests/auth'
import { HttpError } from '@/lib/http'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const cookiesStore = await cookies()
  const sessionToken = cookiesStore.get('sessionToken')?.value

  if (!sessionToken) {
    return Response.json({ message: 'Session token not found' }, { status: 401 })
  }

  try {
    const res = await authApiRequest.slideSessionFromNextServerToServer(sessionToken)

    const newExpiresDate = new Date((res.payload.data as any).expiresAt).toUTCString()

    return Response.json(res, {
      status: 200,
      headers: {
        'Set-Cookie': `sessionToken=${(res.payload.data as any).token}; HttpOnly; Path=/; Expires=${newExpiresDate}`
      }
    })
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, { status: error.status })
    } else {
      return Response.json({ message: 'Internal Server Error' }, { status: 500 })
    }
  }
}

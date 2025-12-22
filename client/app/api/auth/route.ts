export async function POST(request: Request) {
  const body = await request.json()
  const sessionToken = body.sessionToken as string
  const expiresAt = body.expiresAt as string

  if (!sessionToken) {
    return Response.json({ message: 'Session token not found' }, { status: 401 })
  }

  const expiresDate = new Date(expiresAt).toUTCString()

  return Response.json(body, {
    status: 200,
    headers: {
      'Set-Cookie': `sessionToken=${sessionToken}; HttpOnly; Path=/; Expires=${expiresDate}`
    }
  })
}

import envConfig from '@/config'
import { LoginResType } from '@/schemaValidations/auth.schema'
import { redirect } from 'next/navigation'

type CustomOptions = Omit<RequestInit, 'method'> & {
  baseUrl?: string | undefined
}

const ENTITY_ERROR_STATUS = 422
const AUTHENTICATION_ERROR_STATUS = 401

type EntityErrorPayload = {
  message: string
  errors: {
    field: string
    message: string
  }[]
}

export class HttpError extends Error {
  status: number
  payload: {
    message: string
    [key: string]: any
  }

  constructor({ status, payload }: { status: number; payload: any }) {
    super('HTTP Error')
    this.status = status
    this.payload = payload
  }
}

export class EntityError extends HttpError {
  status: number
  payload: EntityErrorPayload

  constructor({ status, payload }: { status: number; payload: EntityErrorPayload }) {
    super({ status, payload })
    this.status = ENTITY_ERROR_STATUS
    this.payload = payload
  }
}

class SessionToken {
  private token = ''
  private _expiresAt = new Date().toISOString()

  get value() {
    return this.token
  }

  set value(token: string) {
    if (typeof window !== 'undefined') {
      this.token = token
    }
    // throw new Error('Cannot set token on server side')
  }

  get expiresAt() {
    return this._expiresAt
  }

  set expiresAt(expiresAt: string) {
    if (typeof window !== 'undefined') {
      this._expiresAt = expiresAt
    }
    // throw new Error('Cannot set expiresAt on server side')
  }
}

export const clientSessionToken = new SessionToken()
const clientLogoutRequest: { value: null | Promise<any> } = { value: null }

const request = async <Response>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  options: CustomOptions | undefined
) => {
  const body = options?.body ? JSON.stringify(options.body) : undefined
  const baseHeaders = {
    'Content-Type': 'application/json',
    ...(clientSessionToken.value ? { Authorization: `Bearer ${clientSessionToken.value}` } : {})
  }

  const baseUrl = options?.baseUrl !== undefined && options.baseUrl === '' ? '' : envConfig.NEXT_PUBLIC_API_ENDPOINT
  const trimmedUrl = url.startsWith('/') ? url.slice(1) : url
  const fullUrl = `${baseUrl}/${trimmedUrl}`

  const response = await fetch(fullUrl, {
    method,
    headers: {
      ...baseHeaders,
      ...options?.headers
    },
    body
  })
  const payload: Response = await response.json()
  const data = {
    status: response.status,
    payload
  }

  if (!response.ok) {
    switch (response.status) {
      case ENTITY_ERROR_STATUS:
        throw new EntityError(
          data as {
            status: number
            payload: EntityErrorPayload
          }
        )
        break

      case AUTHENTICATION_ERROR_STATUS:
        if (typeof window === 'undefined') {
          const sessionToken = (options?.headers as any)?.Authorization?.split(' ')[1] || ''
          redirect(`/logout?sessionToken=${sessionToken}`)
        } else {
          if (!clientLogoutRequest.value) {
            clientLogoutRequest.value = fetch('/api/auth/logout', {
              method: 'POST',
              body: JSON.stringify({ force: true }),
              headers: {
                ...baseHeaders
              }
            })

            await clientLogoutRequest.value
            clientSessionToken.value = ''
            clientLogoutRequest.value = null
            location.href = '/login'
          }
        }
        break

      default:
        throw new HttpError(data)
        break
    }
  }

  if (typeof window !== 'undefined') {
    if (['auth/login', 'auth/register'].some((path) => path === trimmedUrl)) {
      clientSessionToken.value = (payload as LoginResType).data?.token
      clientSessionToken.expiresAt = (payload as LoginResType).data?.expiresAt
    } else if (['api/auth/logout'].some((path) => path === trimmedUrl)) {
      clientSessionToken.value = ''
      clientSessionToken.expiresAt = new Date().toISOString()
    }
  }

  return data
}

const http = {
  get: <Response>(url: string, options?: Omit<CustomOptions, 'body'> | undefined) =>
    request<Response>('GET', url, options),
  post: <Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) =>
    request<Response>('POST', url, { ...options, body }),
  put: <Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) =>
    request<Response>('PUT', url, { ...options, body }),
  delete: <Response>(url: string, options?: Omit<CustomOptions, 'body'> | undefined) =>
    request<Response>('DELETE', url, options)
}

export default http

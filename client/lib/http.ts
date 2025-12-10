import envConfig from '@/config'
import { LoginResType } from '@/schemaValidations/auth.schema'

type CustomOptions = Omit<RequestInit, 'method'> & {
  baseUrl?: string | undefined
}

const ENTITY_ERROR_STATUS = 422

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

  get value() {
    return this.token
  }

  set value(token: string) {
    // if (typeof window === 'undefined') {
    //     throw new Error('Cannot set token on server side')
    // }
    this.token = token
  }
}

export const clientSessionToken = new SessionToken()

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

  console.log('options', options)

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
    throw new HttpError(data)
  }

  if (typeof window !== 'undefined') {
    if (['auth/login', 'auth/register'].some((path) => path === trimmedUrl)) {
      clientSessionToken.value = (payload as LoginResType).data?.token
    } else if (['api/auth/logout'].some((path) => path === trimmedUrl)) {
      clientSessionToken.value = ''
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

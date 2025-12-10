import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { UseFormSetError } from 'react-hook-form'
import { EntityError } from '@/lib/http'
import { toast } from 'sonner'
import jwt from 'jsonwebtoken'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleErrorApi = ({
  error,
  setError,
  duration
}: {
  error: any
  setError?: UseFormSetError<any>
  duration?: number
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((err) => {
      setError(err.field, { type: 'server', message: err.message })
    })
  } else {
    toast.error(error.payload?.message || 'An unexpected error occurred. Please try again later.', { duration })
  }
}

export const decodeJWT = <Payload = any>(token: string) => {
  return jwt.decode(token) as Payload
}

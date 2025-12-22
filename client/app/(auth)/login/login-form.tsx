'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoginBody, LoginBodyType } from '@/schemaValidations/auth.schema'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import authApiRequest from '@/apiRequests/auth'
import { handleErrorApi } from '@/lib/utils'
import { useState } from 'react'

const formSchema = LoginBody

type FormValues = LoginBodyType

export default function LoginForm() {
  const [loading, setLoading] = useState(false)
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })
  const router = useRouter()

  async function onSubmit(values: FormValues) {
    if (loading) return

    setLoading(true)
    try {
      const result = await authApiRequest.login(values)

      toast.success(result.payload.message)

      await authApiRequest.auth({ sessionToken: result.payload.data.token, expiresAt: result.payload.data.expiresAt })

      // redirect to profile page
      router.push('/me')
    } catch (error: any) {
      handleErrorApi({ error, setError: form.setError })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (error) => console.log(error))}
        className='space-y-2 max-w-[600px] shrink-0 w-full'
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem className='mt-5'>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='Email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='mt-5'>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder='Password' type='password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='mt-5 w-full cursor-pointer'>
          Submit
        </Button>
      </form>
    </Form>
  )
}

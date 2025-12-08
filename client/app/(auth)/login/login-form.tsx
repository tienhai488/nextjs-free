'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoginBody, LoginBodyType } from '@/src/schemaValidations/auth.schema'
import envConfig from '@/config'
import { toast } from 'sonner'

const formSchema = LoginBody

type FormValues = LoginBodyType

export default function LoginForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  async function onSubmit(values: FormValues) {
    try {
      const result = await fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })

      const res = await result.json()

      const data = {
        status: result.status,
        payload: res
      }

      if (!result.ok) {
        throw data
      }

      toast.success(res.message)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errors = error.payload?.errors as {
        field: string
        message: string
      }[]

      const status = error.status as number

      if (status == 422) {
        errors.forEach((err) => {
          form.setError(err.field as keyof FormValues, { type: 'server', message: err.message })
        })
      } else {
        toast.error(error.payload?.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau!')
      }
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

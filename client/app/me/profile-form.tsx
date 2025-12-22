'use client'
import accountApiRequest from '@/apiRequests/account'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { handleErrorApi } from '@/lib/utils'
import { AccountResType, UpdateMeBody, UpdateMeBodyType } from '@/schemaValidations/account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type Profile = AccountResType['data']

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [loading, setLoading] = useState(false)
  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name: profile?.name || ''
    }
  })
  const router = useRouter()

  async function onSubmit(data: UpdateMeBodyType) {
    if (loading) return
    setLoading(true)
    try {
      const result = await accountApiRequest.updateMe(data)

      toast.success(result.payload.message)

      router.refresh()
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-x-2 max-w-[600px] shrink-0 w-full' noValidate>
        <FormLabel className='mt-5 mb-2'>Username</FormLabel>
        <FormControl>
          <Input placeholder='shadcn' type='email' value={profile.email} readOnly />
        </FormControl>
        <FormMessage />

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='m-0'>
              <FormLabel className='mt-5 mb-2'>Name</FormLabel>
              <FormControl>
                <Input placeholder='Name' type='text' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='mt-8! w-full cursor-pointer' disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </form>
    </Form>
  )
}

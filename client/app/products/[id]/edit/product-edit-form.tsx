'use client'

import productApiRequest from '@/apiRequests/product'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { handleErrorApi } from '@/lib/utils'
import { ProductResType, UpdateProductBody, UpdateProductBodyType } from '@/schemaValidations/product.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type Product = ProductResType['data']

export default function ProductEditForm({ product }: { product: Product }) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const form = useForm<UpdateProductBodyType>({
    resolver: zodResolver(UpdateProductBody),
    defaultValues: {
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image
    }
  })
  const image = form.watch('image')

  async function onSubmit(data: UpdateProductBodyType) {
    if (loading) return

    try {
      setLoading(true)

      let imageUrl: string = data.image
      if (file) {
        const formData = new FormData()
        formData.append('file', file as Blob)
        const uploadRes = await productApiRequest.uploadImage(formData)
        imageUrl = uploadRes.payload.data
      }

      if (!product.id) {
        throw new Error('Product ID is missing')
      }

      const result = await productApiRequest.update(product.id as any, {
        ...data,
        image: imageUrl
      })

      toast.success(result.payload.message)

      router.push('/products')
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
      <form
        onSubmit={form.handleSubmit(onSubmit, (error) => {
          console.log(error)
          console.log(image)
        })}
        className='space-y-2 max-w-[600px] shrink-0 w-full'
        noValidate
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Name' type='text' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='price'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  placeholder='Price'
                  type='number'
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder='Description' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='image'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hình ảnh</FormLabel>
              <FormControl>
                <Input
                  ref={inputRef}
                  type='file'
                  accept='image/*'
                  onClick={(e: any) => (e.target.value = null)}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setFile(file)
                      field.onChange('http://localhost:3000/' + file.name)
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {(file || image) && (
          <div>
            <Image
              src={file ? URL.createObjectURL(file) : image}
              width={128}
              height={128}
              alt='preview'
              className='w-32 h-32 object-cover'
            />
            <Button
              type='button'
              variant={'destructive'}
              size={'sm'}
              className='cursor-pointer mt-2'
              onClick={() => {
                setFile(null)
                form.setValue('image', '')

                if (inputRef.current) {
                  inputRef.current.value = ''
                }
              }}
            >
              Delete Image
            </Button>
          </div>
        )}

        <Button type='submit' className='mt-8! w-full cursor-pointer' disabled={loading}>
          {loading ? 'Loading...' : 'Update Product'}
        </Button>
      </form>
    </Form>
  )
}

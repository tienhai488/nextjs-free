'use client'

import productApiRequest from '@/apiRequests/product'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { handleErrorApi } from '@/lib/utils'
import { ProductResType } from '@/schemaValidations/product.schema'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type Product = ProductResType['data']

export function DeleteButton({ product }: { product: Product }) {
  const router = useRouter()

  async function deleteProduct() {
    try {
      const res = await productApiRequest.delete(product.id as any)
      toast.success(res.payload.message)

      router.refresh()
    } catch (error) {
      handleErrorApi({
        error
      })
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='destructive' className='cursor-pointer'>
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the product &quot;{product.name}&quot;.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteProduct}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

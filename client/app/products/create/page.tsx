import ProductCreateForm from '@/app/products/_components/product-create-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Product'
}

export default function ProductCreatePage() {
  return (
    <div>
      <h1>Create Product</h1>
      <ProductCreateForm />
    </div>
  )
}

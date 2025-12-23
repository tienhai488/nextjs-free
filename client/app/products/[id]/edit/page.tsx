import productApiRequest from '@/apiRequests/product'
import ProductEditForm from '@/app/products/_components/product-edit-form'
import { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  // read route params
  const { id } = await params

  let product = null
  try {
    const data = await productApiRequest.getDetail(id)
    product = data.payload.data
  } catch (error) {
    //
  }

  return {
    title: product ? product.name : 'Product Not Found',
    description: product ? `Details of ${product.name}` : 'No product details available'
  }
}

export default async function ProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let product = null
  try {
    const res = await productApiRequest.getDetail(id)
    product = res.payload.data
  } catch (error) {
    //
  }

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div>
      <ProductEditForm product={product} />
    </div>
  )
}

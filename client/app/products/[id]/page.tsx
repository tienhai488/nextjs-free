import productApiRequest from '@/apiRequests/product'
import { Metadata, ResolvingMetadata } from 'next'
import Image from 'next/image'

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

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let product = null
  try {
    const data = await productApiRequest.getDetail(id)
    product = data.payload.data
  } catch (error) {
    //
  }

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div>
      <Image src={product.image} alt={product.name} width={180} height={180} className='w-32 h-32 object-cover' />

      <h3>{product.name}</h3>
      <div>{product.price}</div>
    </div>
  )
}

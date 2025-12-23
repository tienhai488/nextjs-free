import productApiRequest from '@/apiRequests/product'
import Image from 'next/image'

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

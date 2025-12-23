import productApiRequest from '@/apiRequests/product'
import ProductEditForm from '@/app/products/_components/product-edit-form'

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

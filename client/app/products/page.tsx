import productApiRequest from '@/apiRequests/product'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default async function ProductsPage() {
  const { payload } = await productApiRequest.getList()

  const productList = payload.data

  return (
    <div>
      <h1>Product List</h1>
      <div className='space-y-5'>
        {productList.map((product) => (
          <div className='flex space-x-2' key={product.id}>
            <Image src={product.image} width={180} height={180} alt={product.name} className='w-36 h-36 object-cover' />
            <h3>{product.name}</h3>
            <div>{product.price}</div>
            <div className='flex space-x-2'>
              <Button>Edit</Button>
              <Button>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import http from '@/lib/http'
import { MessageResType } from '@/schemaValidations/common.schema'
import { CreateProductBodyType, ProductListResType, ProductResType } from '@/schemaValidations/product.schema'

const productApiRequest = {
  getList: () => http.get<ProductListResType>('/products'),
  getDetail: (id: string) => http.get<ProductResType>(`/products/${id}`),
  create: (body: CreateProductBodyType) => http.post<ProductResType>('/products', body),
  update: (id: string, body: CreateProductBodyType) => http.put<ProductResType>(`/products/${id}`, body),
  uploadImage: (body: FormData) =>
    http.post<{
      message: string
      data: string
    }>('/media/upload', body),
  delete: (id: string) => http.delete<MessageResType>(`/products/${id}`)
}

export default productApiRequest

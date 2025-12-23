import http from '@/lib/http'
import { CreateProductBodyType, ProductListResType, ProductResType } from '@/schemaValidations/product.schema'
import { id } from 'zod/locales'

const productApiRequest = {
  getList: () => http.get<ProductListResType>('/products'),
  getDetail: (id: string) => http.get<ProductResType>(`/products/${id}`),
  create: (body: CreateProductBodyType) => http.post<ProductResType>('/products', body),
  update: (id: string, body: CreateProductBodyType) => http.put<ProductResType>(`/products/${id}`, body),
  uploadImage: (body: FormData) =>
    http.post<{
      message: string
      data: string
    }>('/media/upload', body)
}

export default productApiRequest

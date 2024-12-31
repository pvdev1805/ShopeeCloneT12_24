import { keepPreviousData, useQuery } from '@tanstack/react-query'
import AsideFilter from './AsideFilter'
import Product from './Product/Product'
import SortProductList from './SortProductList'
import productApi from '../../apis/product.api'
import useQueryParams from '../../hooks/useQueryParams'
import Pagination from '../../components/Pagination'
import { useState } from 'react'
import { ProductListConfig } from '../../types/product.type'
import { isUndefined, omitBy } from 'lodash'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

const ProductList = () => {
  const queryParams: QueryConfig = useQueryParams()

  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit,
      sort_by: queryParams.sort_by,
      order: queryParams.order,
      exclude: queryParams.exclude,
      rating_filter: queryParams.rating_filter,
      price_max: queryParams.price_max,
      price_min: queryParams.price_min,
      name: queryParams.name
    },
    isUndefined
  )

  // const [page, setPage] = useState(1)

  const { data } = useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    placeholderData: keepPreviousData
  })

  // console.log(queryParams)
  // console.log(data)

  return (
    <>
      <div className='bg-gray-200 py-6'>
        <div className='container'>
          {data && (
            <div className='grid grid-cols-12 gap-6'>
              <div className='col-span-3'>
                <AsideFilter />
              </div>

              <div className='col-span-9'>
                <SortProductList />

                <div className='mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3'>
                  {data.data.data.products.map((product) => (
                    <div className='col-span-1' key={product._id}>
                      <Product product={product} />
                    </div>
                  ))}
                </div>

                <Pagination queryConfig={queryConfig} pageSize={data.data.data.pagination.page_size} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ProductList

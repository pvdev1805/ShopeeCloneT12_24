import { keepPreviousData, useQuery } from '@tanstack/react-query'
import AsideFilter from './components/AsideFilter'
import Product from './components/Product/Product'
import SortProductList from './components/SortProductList'
import productApi from '../../apis/product.api'
import Pagination from '../../components/Pagination'
import { ProductListConfig } from '../../types/product.type'
import categoryApi from '../../apis/category.api'
import useQueryConfig from '../../hooks/useQueryConfig'
import { Helmet } from 'react-helmet-async'

const ProductList = () => {
  const queryConfig = useQueryConfig()

  // const [page, setPage] = useState(1)

  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    placeholderData: keepPreviousData,
    staleTime: 3 * 60 * 1000
  })

  // console.log(queryParams)
  // console.log(data)

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories()
    },
    placeholderData: keepPreviousData
  })

  return (
    <>
      <div className='bg-gray-200 py-6'>
        <Helmet>
          <title>Homepage | Shopee Clone</title>
          <meta name='description' content='Homepage of the Shopee Clone project' />
        </Helmet>

        <div className='container'>
          {productsData && (
            <div className='grid grid-cols-12 gap-6'>
              <div className='col-span-12 md:col-span-3'>
                <AsideFilter queryConfig={queryConfig} categories={categoriesData?.data.data || []} />
              </div>

              <div className='col-span-12 md:col-span-9'>
                <SortProductList queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} />

                <div className='mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3'>
                  {productsData.data.data.products.map((product) => (
                    <div className='col-span-1' key={product._id}>
                      <Product product={product} />
                    </div>
                  ))}
                </div>

                <Pagination queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ProductList

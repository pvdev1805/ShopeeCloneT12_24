import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import DOMPurify from 'dompurify'
import productApi from '../../apis/product.api'
import ProductRating from '../../components/ProductRating'
import { formatCurrency, formatNumberToSocialStyle, getIdFromNameId, rateSale } from '../../utils/utils'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ProductListConfig, Product as ProductType } from '../../types/product.type'
import Product from '../ProductList/components/Product'
import QuantityController from '../../components/QuantityController'
import purchaseApi from '../../apis/purchase.api'
import { purchasesStatus } from '../../constants/purchase'
import { toast } from 'react-toastify'
import path from '../../constants/path'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { convert } from 'html-to-text'

const ProductDetail = () => {
  const { t } = useTranslation(['product'])
  const queryClient = useQueryClient()

  const [buyCount, setBuyCount] = useState(1)

  const { nameId } = useParams()

  const id = getIdFromNameId(nameId as string)

  const { data: productDetailData } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProductDetail(id as string)
  })

  const addToCartMutation = useMutation({
    mutationFn: purchaseApi.addToCart
  })

  const navigate = useNavigate()

  const [currentIndexImages, setCurrentIndexImages] = useState([0, 5])

  const [activeImage, setActiveImage] = useState('')

  const product = productDetailData?.data.data

  const imageRef = useRef<HTMLImageElement>(null)

  const currentImages = useMemo(
    () => (product ? product.images.slice(...currentIndexImages) : []),
    [product, currentIndexImages]
  )

  const queryConfig: ProductListConfig = { limit: '20', page: '1', category: product?.category._id }

  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig)
    },
    staleTime: 3 * 60 * 1000,
    enabled: Boolean(product)
  })

  console.log(productsData)

  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImage(product.images[0])
    }
  }, [product])

  const prev = () => {
    if (currentIndexImages[0] > 0) {
      setCurrentIndexImages((prev) => [prev[0] - 1, prev[1] - 1])
    }
  }

  const next = () => {
    console.log(currentIndexImages)
    if (currentIndexImages[1] < (product as ProductType).images.length) {
      setCurrentIndexImages((prev) => [prev[0] + 1, prev[1] + 1])
    }
  }

  const chooseActive = (img: string) => {
    setActiveImage(img)
  }

  const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    // console.log(rect)
    // console.log(event.target)

    const image = imageRef.current as HTMLImageElement
    const { naturalHeight, naturalWidth } = image

    // Solution 1: get offsetX, offsetY simply when we have already resolved the problem of bubble event
    // const {offsetX, offsetY} = event.nativeEvent

    // Solution 2: get offsetX, offsetY when we could not resolve the bubble event
    const offsetX = event.pageX - (rect.x + window.scrollX)
    const offsetY = event.pageY - (rect.y + window.scrollY)

    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)
    image.style.width = naturalWidth + 'px'
    image.style.height = naturalHeight + 'px'
    image.style.maxWidth = 'unset'
    image.style.top = top + 'px'
    image.style.left = left + 'px'
  }

  const handleRemoveZoom = () => {
    imageRef.current?.removeAttribute('style')
  }

  const handleBuyCount = (value: number) => {
    setBuyCount(value)
  }

  const addToCart = () => {
    addToCartMutation.mutate(
      { product_id: product?._id as string, buy_count: buyCount },
      {
        onSuccess: (data) => {
          toast.success(data.data.message, { autoClose: 1000 })
          queryClient.invalidateQueries({ queryKey: ['purchases', { status: purchasesStatus.inCart }] })
        }
      }
    )
  }

  const buyNow = async () => {
    const res = await addToCartMutation.mutateAsync({
      product_id: product?._id as string,
      buy_count: buyCount
    })

    const purchase = res.data.data

    navigate(path.cart, {
      state: {
        purchaseId: purchase._id
      }
    })
  }

  if (!product) return null

  return (
    <>
      <div className='bg-gray-200 py-6'>
        <Helmet>
          <title>{product.name} | Shopee Clone</title>
          <meta
            name='description'
            content={convert(product.description, {
              limits: {
                maxInputLength: 150
              }
            })}
          />
        </Helmet>

        <div className='container'>
          <div className='bg-white p-4 shadow'>
            <div className='grid grid-cols-12 gap-2 lg:gap-9'>
              <div className='col-span-12 md:col-span-5'>
                <div
                  className='relative w-full pt-[100%] shadow cursor-zoom-in overflow-hidden'
                  onMouseMove={handleZoom}
                  onMouseLeave={handleRemoveZoom}
                >
                  <img
                    src={activeImage}
                    alt={product.name}
                    className='absolute top-0 left-0 h-full w-full bg-white object-cover pointer-events-none'
                    ref={imageRef}
                  />
                </div>

                <div className='relative mt-4 grid grid-cols-5 gap-1'>
                  <button
                    className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                    onClick={prev}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='size-6'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
                    </svg>
                  </button>

                  {currentImages.slice(0, 5).map((img) => {
                    const isActive = img === activeImage

                    return (
                      <div className='relative w-full pt-[100%]' key={img} onMouseEnter={() => chooseActive(img)}>
                        <img
                          src={img}
                          alt={product.name}
                          className='absolute top-0 left-0 h-full w-full cursor-pointer bg-white object-cover'
                        />

                        {isActive && <div className='absolute inset-0 border-2 border-orange'></div>}
                      </div>
                    )
                  })}

                  <button
                    className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                    onClick={next}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='size-6'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                    </svg>
                  </button>
                </div>
              </div>

              <div className='col-span-12 md:col-span-7'>
                <h1 className='text-lg md:text-xl font-medium uppercase'>{product.name} </h1>
                <div className='mt-8 flex items-center'>
                  <div className='flex items-center'>
                    <span className='mr-1 border-b border-b-orange text-orange'>{product.rating} </span>

                    <ProductRating
                      rating={product.rating}
                      activeClassname='size-4 fill-orange text-orange'
                      nonActiveClassname='size-4 fill-gray-300 text-gray-300'
                    />
                  </div>

                  <div className='mx-4 h-4 w-[1px] bg-gray-300'></div>

                  <div>
                    <span>{formatNumberToSocialStyle(product.sold)}</span>
                    <span className='ml-1 text-gray-500'>{t('product:product.status.sold')}</span>
                  </div>
                </div>

                <div className='mt-8 flex items-center bg-gray-50 px-5 py-4'>
                  <div className='text-gray-500 line-through'>${formatCurrency(product.price_before_discount)} </div>

                  <div className='ml-3 text-xl md:text-3xl font-medium text-orange'>
                    ${formatCurrency(product.price)}
                  </div>

                  <div className='ml-4 rounded-sm bg-orange px-1 py-[2px] text-xs font-semibold uppercase text-white'>
                    {rateSale(product.price_before_discount, product.price)} {t('product:product.status.off')}
                  </div>
                </div>

                <div className='mt-8 flex items-center'>
                  <div className='capitalize text-gray-500'>{t('product:product.quantity')}</div>

                  <QuantityController
                    onIncrease={handleBuyCount}
                    onDecrease={handleBuyCount}
                    onType={handleBuyCount}
                    value={buyCount}
                    max={product.quantity}
                  />

                  <div className='ml-6 text-sm text-gray-500'>
                    {product.quantity} {t('product:available')}{' '}
                  </div>
                </div>

                <div className='mt-8 flex items-center'>
                  <button
                    onClick={addToCart}
                    className='flex h-12 items-center justify-center rounded-sm border border-orange bg-orange/10 px-5 capitalize text-orange shadow-sm hover:bg-orange/5'
                  >
                    <svg
                      enableBackground='new 0 0 15 15'
                      viewBox='0 0 15 15'
                      x={0}
                      y={0}
                      className='mr-[10px] size-5 fill-current stroke-orange text-orange'
                    >
                      <g>
                        <g>
                          <polyline
                            fill='none'
                            points='.5 .5 2.7 .5 5.2 11 12.4 11 14.5 3.5 3.7 3.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeMiterlimit={10}
                          />
                          <circle cx={6} cy='13.5' r={1} stroke='none' />
                          <circle cx='11.5' cy='13.5' r={1} stroke='none' />
                        </g>
                        <line
                          fill='none'
                          strokeLinecap='round'
                          strokeMiterlimit={10}
                          x1='7.5'
                          x2='10.5'
                          y1={7}
                          y2={7}
                        />
                        <line fill='none' strokeLinecap='round' strokeMiterlimit={10} x1={9} x2={9} y1='8.5' y2='5.5' />
                      </g>
                    </svg>
                    {t('product:action.add to cart')}
                  </button>

                  <button
                    onClick={buyNow}
                    className='flex ml-4 h-12 min-w-[5rem] items-center justify-center rounded-sm bg-orange px-5 capitalize text-white shadow-sm outline-none hover:bg-orange/90'
                  >
                    {t('product:action.buy now')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-8'>
          <div className='container'>
            <div className='bg-white p-4 shadow'>
              <div className='rounded bg-gray-50 p-4 text-lg capitalize text-slate-700'>
                {t('product.product description')}
              </div>

              <div className='mx-4 mt-12 mb-4 text-sm leading-loose'>
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(product.description)
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-8'>
          <div className='container'>
            <div className='uppercase text-gray-400'>{t('product:product.related products')}</div>

            {productsData && (
              <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
                {productsData.data.data.products.map((product) => (
                  <div className='col-span-1' key={product._id}>
                    <Product product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductDetail

import { Link } from 'react-router-dom'
import { Product as ProductType } from '../../../../types/product.type'
import { formatCurrency, formatNumberToSocialStyle, generateNameId } from '../../../../utils/utils'
import ProductRating from '../../../../components/ProductRating'
import path from '../../../../constants/path'
import { useTranslation } from 'react-i18next'

interface Props {
  product: ProductType
}

const Product = ({ product }: Props) => {
  const { t } = useTranslation('product')

  return (
    <>
      <Link to={`${path.home}${generateNameId({ name: product.name, id: product._id })}`}>
        <div className='bg-white shadow rounded-sm hover:translate-y-[-0.04rem] hover:shadow-md duration-100 transition-transform overflow-hidden'>
          <div className='w-full pt-[100%] relative'>
            <img
              src={product.image}
              alt={product.name}
              className='absolute top-0 left-0 bg-white w-full h-full object-cover'
            />
          </div>
          <div className='p-2 overflow-hidden'>
            <div className='min-h-[2rem] line-clamp-2 text-xs'>{product.name}</div>
            <div className='flex items-center mt-3'>
              <div className='line-through max-w-[50%] text-gray-500 truncate'>
                <span className='text-xs'>$</span>
                <span className='text-sm'>{formatCurrency(product.price_before_discount)}</span>
              </div>
              <div className='text-orange truncate ml-1'>
                <span className='text-xs'>$</span>
                <span className='text-sm'>{formatCurrency(product.price)} </span>
              </div>
            </div>
            <div className='mt-3 flex items-center justify-end'>
              <div className='flex items-center'>
                <ProductRating rating={product.rating} />
              </div>

              <div className='ml-2 text-sm'>
                <span>{formatNumberToSocialStyle(product.sold)} </span>
                <span className='ml-1'>{t('product.status.sold')}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  )
}

export default Product

import classNames from 'classnames'
import { sortBy, order as OrderConstant } from '../../../../constants/product'
import { ProductListConfig } from '../../../../types/product.type'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import { QueryConfig } from '../../../../hooks/useQueryConfig'
import path from '../../../../constants/path'
import omit from 'lodash/omit'
import { useTranslation } from 'react-i18next'

interface Props {
  queryConfig: QueryConfig
  pageSize: number
}

const SortProductList = ({ queryConfig, pageSize }: Props) => {
  const { t } = useTranslation('home')

  const page = Number(queryConfig.page)

  const { sort_by = sortBy.createdAt, order } = queryConfig

  const navigate = useNavigate()

  const isActiveSortBy = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    return sort_by === sortByValue
  }

  const handleSort = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: sortByValue
          },
          ['order']
        )
      ).toString()
    })
  }

  const handlePriceOrder = (orderValue: Exclude<ProductListConfig['order'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        sort_by: sortBy.price,
        order: orderValue
      }).toString()
    })
  }

  return (
    <>
      <div className='bg-gray-300/40 py-4 px-3'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <div className='flex items-center flex-wrap gap-2'>
            <div>{t('sort.sort by')}</div>
            <button
              className={classNames('h-8 px-4 capitalize text-sm text-center', {
                'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortBy.view),
                'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.view)
              })}
              onClick={() => handleSort(sortBy.view)}
            >
              {t('sort.popularity')}
            </button>
            <button
              className={classNames('h-8 px-4 capitalize text-sm text-center', {
                'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortBy.createdAt),
                'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.createdAt)
              })}
              onClick={() => handleSort(sortBy.createdAt)}
            >
              {t('sort.new arrivals')}
            </button>
            <button
              className={classNames('h-8 px-4 capitalize text-sm text-center', {
                'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortBy.sold),
                'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.sold)
              })}
              onClick={() => handleSort(sortBy.sold)}
            >
              {t('sort.best sellers')}
            </button>
            <select
              className={classNames('h-8 px-4 capitalize text-sm text-left outline-none', {
                'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortBy.price),
                'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.price)
              })}
              value={order || ''}
              onChange={(event) =>
                handlePriceOrder(event.target.value as Exclude<ProductListConfig['order'], undefined>)
              }
            >
              <option value='' disabled className='bg-white text-black'>
                {t('sort.price order')}
              </option>
              <option value={OrderConstant.asc} className='bg-white text-black'>
                {t('sort.price order')}: {t('sort.price sort.low to high')}
              </option>
              <option value={OrderConstant.desc} className='bg-white text-black'>
                {t('sort.price order')}: {t('sort.price sort.high to low')}
              </option>
            </select>
          </div>
          <div className='flex items-center'>
            <div>
              <span className='text-orange'>{page}</span>
              <span>/{pageSize}</span>
            </div>
            <div className='ml-2 flex'>
              {page === 1 ? (
                <span className='flex h-8 w-9 cursor-not-allowed items-center justify-center rounded-tl-sm rounded-bl-sm bg-white/60 shadow hover:bg-slate-100'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-3'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                  </svg>
                </span>
              ) : (
                <Link
                  to={{
                    pathname: path.home,
                    search: createSearchParams({
                      ...queryConfig,
                      page: (page - 1).toString()
                    }).toString()
                  }}
                  className='flex h-8 w-9 items-center justify-center rounded-tl-sm rounded-bl-sm bg-white shadow hover:bg-slate-100'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-3'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                  </svg>
                </Link>
              )}

              {page === pageSize ? (
                <span className='flex h-8 w-9 cursor-not-allowed items-center justify-center rounded-tl-sm rounded-bl-sm bg-white/60 shadow hover:bg-slate-100'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-3'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                  </svg>
                </span>
              ) : (
                <Link
                  to={{
                    pathname: path.home,
                    search: createSearchParams({
                      ...queryConfig,
                      page: (page + 1).toString()
                    }).toString()
                  }}
                  className='flex h-8 w-9 items-center justify-center rounded-tl-sm rounded-bl-sm bg-white shadow hover:bg-slate-100'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-3'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SortProductList

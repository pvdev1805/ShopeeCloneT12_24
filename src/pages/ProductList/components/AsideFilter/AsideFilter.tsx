import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import path from '../../../../constants/path'
import Button from '../../../../components/Button'
import { Category } from '../../../../types/category.type'
import classNames from 'classnames'
import InputNumber from '../../../../components/InputNumber'
import { useForm, Controller } from 'react-hook-form'
import { Schema, schema } from '../../../../utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { NoUndefinedField } from '../../../../types/utils.type'
import RatingStars from '../RatingStars'
import omit from 'lodash/omit'
import { QueryConfig } from '../../../../hooks/useQueryConfig'
import { ObjectSchema } from 'yup'
import { useTranslation } from 'react-i18next'
// import InputV2 from '../../../../components/InputV2'

interface Props {
  queryConfig: QueryConfig
  categories: Category[]
}

type FormData = NoUndefinedField<Pick<Schema, 'price_max' | 'price_min'>>

const priceSchema = schema.pick(['price_min', 'price_max'])

const AsideFilter = ({ queryConfig, categories }: Props) => {
  const { t } = useTranslation('home')
  const { category } = queryConfig

  const {
    control,
    handleSubmit,
    // watch,
    trigger,
    formState: { errors },
    reset
  } = useForm<FormData>({
    defaultValues: {
      price_min: '',
      price_max: ''
    },
    resolver: yupResolver<FormData>(priceSchema as ObjectSchema<FormData>)
  })

  // console.log(category, categories)

  const navigate = useNavigate()

  const onSubmit = handleSubmit((data) => {
    // console.log(data);

    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        price_max: data.price_max,
        price_min: data.price_min
      }).toString()
    })
  })

  const handleRemoveAll = () => {
    reset()
    navigate({
      pathname: path.home,
      search: createSearchParams(omit(queryConfig, ['price_min', 'price_max', 'rating_filter', 'category'])).toString()
    })
  }

  return (
    <>
      <div className='py-4'>
        <Link
          to={path.home}
          className={classNames('flex items-center font-bold', {
            'text-orange': !category
          })}
        >
          <svg viewBox='0 0 12 10' className='w-3 h-4 mr-3 fill-current'>
            <g fillRule='evenodd' stroke='none' strokeWidth={1}>
              <g transform='translate(-373 -208)'>
                <g transform='translate(155 191)'>
                  <g transform='translate(218 17)'>
                    <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                    <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                    <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  </g>
                </g>
              </g>
            </g>
          </svg>
          {t('aside filter.all categories')}
        </Link>

        <div className='bg-gray-300 h-[1px] my-4' />

        <ul>
          {categories.map((categoryItem) => {
            const isActive = category === categoryItem._id

            const categoryNameTranslation = `aside filter.categories.${categoryItem.name}`

            return (
              <li className='py-2 pl-2' key={categoryItem._id}>
                <Link
                  to={{
                    pathname: path.home,
                    search: createSearchParams({
                      ...queryConfig,
                      category: categoryItem._id
                    }).toString()
                  }}
                  className={classNames('relative px-2', {
                    'font-semibold text-orange': isActive
                  })}
                >
                  {isActive && (
                    <svg viewBox='0 0 4 7' className='fill-orange h-2 w-2 absolute top-1 left-[-10px]'>
                      <polygon points='4 3.5 0 0 0 7' />
                    </svg>
                  )}

                  {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    t(categoryNameTranslation as any)
                  }
                </Link>
              </li>
            )
          })}
        </ul>

        <Link to={path.home} className='flex items-center font-bold mt-4 uppercase'>
          <svg
            enableBackground='new 0 0 15 15'
            viewBox='0 0 15 15'
            x={0}
            y={0}
            className='w-3 h-4 fill-current stroke-current mr-3'
          >
            <g>
              <polyline
                fill='none'
                points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeMiterlimit={10}
              />
            </g>
          </svg>
          {t('aside filter.filter search')}
        </Link>

        <div className='bg-gray-300 h-[1px] my-4' />

        <div className='my-5'>
          <div>{t('aside filter.price range')}</div>

          <form className='mt-2' onSubmit={onSubmit}>
            <div className='flex items-start'>
              <Controller
                control={control}
                name='price_min'
                render={({ field }) => {
                  return (
                    <InputNumber
                      type='text'
                      className='grow'
                      placeholder={t('aside filter.price.from')}
                      classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                      classNameError='hidden'
                      {...field}
                      onChange={(event) => {
                        field.onChange(event)
                        trigger('price_max')
                      }}
                    />
                  )
                }}
              />

              {/* <InputV2
                control={control}
                name='price-min'
                type='number'
                className='grow'
                placeholder='From'
                classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                classNameError='hidden'
                onChange={() => {
                  trigger('price_max')
                }}
              /> */}

              <div className='mx-2 mt-2 shrink-0'>-</div>

              <Controller
                control={control}
                name='price_max'
                render={({ field }) => {
                  return (
                    <InputNumber
                      type='text'
                      className='grow'
                      placeholder={t('aside filter.price.to')}
                      classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                      classNameError='hidden'
                      {...field}
                      onChange={(event) => {
                        field.onChange(event)
                        trigger('price_min')
                      }}
                    />
                  )
                }}
              />
            </div>

            <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm'>{errors.price_min?.message}</div>

            <Button className='w-full p-2 uppercase bg-orange text-white text-sm hover:bg-orange/80 flex justify-center items-center'>
              {t('aside filter.apply filter')}
            </Button>
          </form>
        </div>

        <div className='bg-gray-300 h-[1px] my-4' />

        <div className='text-lg text-gray-700 my-2'>{t('aside filter.rating')}</div>

        <RatingStars queryConfig={queryConfig} />

        <div className='bg-gray-300 h-[1px] my-4' />

        <Button
          className='w-full p-2 uppercase bg-orange text-white text-sm hover:bg-orange/80 flex justify-center items-center'
          onClick={handleRemoveAll}
        >
          {t('aside filter.clear filter')}
        </Button>
      </div>
    </>
  )
}

export default AsideFilter

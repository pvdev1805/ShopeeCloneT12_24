import { createSearchParams, Link } from 'react-router-dom'
import path from '../../../../constants/path'
import { purchasesStatus } from '../../../../constants/purchase'
import classNames from 'classnames'
import useQueryParams from '../../../../hooks/useQueryParams'
import { useQuery } from '@tanstack/react-query'
import { PurchaseListStatus } from '../../../../types/purchase.type'
import purchaseApi from '../../../../apis/purchase.api'
import { formatCurrency, generateNameId } from '../../../../utils/utils'
import { useTranslation } from 'react-i18next'

const purchaseTabs = [
  { status: purchasesStatus.all, name: 'all' },
  { status: purchasesStatus.waitingForConfirmation, name: 'waiting for confirmation' },
  { status: purchasesStatus.waitingForGetting, name: 'waiting for getting' },
  { status: purchasesStatus.inProgress, name: 'in progress' },
  { status: purchasesStatus.delivered, name: 'delivered' },
  { status: purchasesStatus.cancelled, name: 'cancelled' }
]

const HistoryPurchase = () => {
  const { t } = useTranslation('user')

  const queryParams: { status?: string } = useQueryParams()
  const status: number = Number(queryParams.status) || purchasesStatus.all

  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status: status }],
    queryFn: () => purchaseApi.getPurchases({ status: status as PurchaseListStatus })
  })

  const purchasesInCart = purchasesInCartData?.data.data

  const purchaseTabsLink = purchaseTabs.map((tab) => (
    <Link
      key={tab.status}
      to={{
        pathname: path.historyPurchase,
        search: createSearchParams({
          status: String(tab.status)
        }).toString()
      }}
      className={classNames('flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center capitalize', {
        'border-b-orange text-orange': status === tab.status,
        'border-b-black/10 text-gray-900': status !== tab.status
      })}
    >
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        t(`purchase.status.${tab.name}` as any)
      }
    </Link>
  ))

  return (
    <>
      <div className='overflow-x-auto'>
        <div className='min-w-[700px]'>
          <div className='sticky top-0 flex rounded-t-sm shadow-sm'>{purchaseTabsLink}</div>

          <div>
            {purchasesInCart?.map((purchase) => (
              <div key={purchase._id} className='mt-4 rounded-sm border-black/10 bg-white p-6 text-gray-800 shadow-sm'>
                <Link
                  to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                  className='flex'
                >
                  <div className='flex-shrink-0'>
                    <img className='size-20 object-cover' src={purchase.product.image} alt={purchase.product.name} />
                  </div>

                  <div className='ml-3 flex-grow overflow-hidden'>
                    <div className='truncate'>{purchase.product.name}</div>
                    <div className='mt-3'>{purchase.buy_count}</div>
                  </div>

                  <div className='ml-3 flex-shrink-0'>
                    <div className='truncate text-gray-500 line-through'>
                      <span className='truncate text-gray-500 line-through'>
                        ${formatCurrency(purchase.product.price_before_discount)}
                      </span>
                      <span className='ml-2 truncate text-orange'>${formatCurrency(purchase.product.price)}</span>
                    </div>
                  </div>
                </Link>

                <div className='flex justify-end'>
                  <div>
                    <span>{t('purchase.total')}</span>
                    <span className='ml-4 text-xl text-orange'>
                      ${formatCurrency(purchase.product.price * purchase.buy_count)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default HistoryPurchase

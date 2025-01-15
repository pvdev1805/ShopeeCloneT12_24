import classNames from 'classnames'
import { createSearchParams, Link } from 'react-router-dom'
import path from '../../constants/path'
import { QueryConfig } from '../../hooks/useQueryConfig'

interface Props {
  queryConfig: QueryConfig
  pageSize: number
}

const RANGE = 2

const Pagination = ({ queryConfig, pageSize }: Props) => {
  const page = Number(queryConfig.page)

  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false
    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <span key={index} className='bg-white rounded px-3 py-2 shadow-sm mx-2 border'>
            ...
          </span>
        )
      }
      return null
    }
    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <span key={index} className='bg-white rounded px-3 py-2 shadow-sm mx-2 border'>
            ...
          </span>
        )
      }
      return null
    }
    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1
        // Condition to display the ... before and after the pagination
        if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
          return renderDotAfter(index)
        } else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
          if (pageNumber < page - RANGE && pageNumber > RANGE) {
            return renderDotBefore(index)
          } else if (pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
            return renderDotAfter(index)
          }
        } else if (page >= pageSize - RANGE * 2 && pageNumber > RANGE && pageNumber < page - RANGE) {
          return renderDotBefore(index)
        }
        return (
          <Link
            to={{
              pathname: path.home,
              search: createSearchParams({
                ...queryConfig,
                page: pageNumber.toString()
              }).toString()
            }}
            key={index}
            className={classNames(
              'bg-white rounded px-3 py-2 shadow-sm mx-2 cursor-pointer border hover:bg-cyan-500 hover:text-white',
              {
                'border-cyan-500': pageNumber === page,
                'border-transparent': pageNumber !== page
              }
            )}
          >
            {pageNumber}
          </Link>
        )
      })
  }

  return (
    <>
      <div className='flex flex-wrap mt-6 justify-center'>
        {page === 1 ? (
          <span className='bg-white/60 rounded px-3 py-2 shadow-sm mx-2 cursor-not-allowed border'>Prev</span>
        ) : (
          <Link
            to={{
              pathname: path.home,
              search: createSearchParams({
                ...queryConfig,
                page: (page - 1).toString()
              }).toString()
            }}
            className='bg-white rounded px-3 py-2 shadow-sm mx-2 cursor-pointer border hover:bg-cyan-500 hover:text-white'
          >
            Prev
          </Link>
        )}

        {renderPagination()}

        {page === pageSize ? (
          <span className='bg-white/60 rounded px-3 py-2 shadow-sm mx-2 cursor-not-allowed border'>Next</span>
        ) : (
          <Link
            to={{
              pathname: path.home,
              search: createSearchParams({
                ...queryConfig,
                page: (page + 1).toString()
              }).toString()
            }}
            className='bg-white rounded px-3 py-2 shadow-sm mx-2 cursor-pointer border hover:bg-cyan-500 hover:text-white'
          >
            Next
          </Link>
        )}
      </div>
    </>
  )
}

export default Pagination

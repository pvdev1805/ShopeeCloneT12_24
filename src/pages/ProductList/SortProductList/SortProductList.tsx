const SortProductList = () => {
  return (
    <>
      <div className='bg-gray-300/40 py-4 px-3'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <div className='flex items-center flex-wrap gap-2'>
            <div>Sort By</div>
            <button className='h-8 px-4 capitalize bg-orange text-white text-sm hover:bg-orange/80 text-center'>
              Popularity
            </button>
            <button className='h-8 px-4 capitalize bg-white text-black text-sm hover:bg-slate-100 text-center'>
              New Arrival
            </button>
            <button className='h-8 px-4 capitalize bg-white text-black text-sm hover:bg-slate-100 text-center'>
              Best Seller
            </button>
            <select
              className='h-8 px-4 capitalize bg-white text-black text-sm hover:bg-slate-100 text-left outline-none'
              value=''
            >
              <option value='' disabled>
                Price
              </option>
              <option value='price:asc'>Price: Ascending Order</option>
              <option value='price:desc'>Price: Descending Order</option>
            </select>
          </div>
          <div className='flex items-center'>
            <div>
              <span className='text-orange'>1</span>
              <span>/2</span>
            </div>
            <div className='ml-2'>
              <button className='px-3 h-8 rounded-tl-sm rounded-bl-sm bg-white/60 hover:bg-slate-100 cursor-not-allowed shadow'>
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
              </button>
              <button className='shadow px-3 h-8 rounded-tr-sm rounded-br-sm bg-white hover:bg-slate-100 '>
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
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SortProductList

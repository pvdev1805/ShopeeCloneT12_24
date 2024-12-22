const Footer = () => {
  return (
    <>
      <footer className='py-16 bg-neutral-100'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
            <div className='lg:col-span-1'>
              <div>© 2024 Shopee. All Rights Reserved.</div>
            </div>

            <div className='lg:col-span-2'>
              <div>
                Country & Region: Singapore Indonesia Thailand Malaysia Vietnam Philippines Brazil México Colombia Chile
                Taiwan
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer

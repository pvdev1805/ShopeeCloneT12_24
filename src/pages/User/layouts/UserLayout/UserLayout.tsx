import { Outlet } from 'react-router-dom'
import UserSideNav from '../../components/UserSideNav'
import { Helmet } from 'react-helmet-async'

const UserLayout = () => {
  return (
    <>
      <div className='bg-neutral-100 py-16 text-sm text-gray-400'>
        <Helmet>
          <title>User | Shopee</title>
          <meta name='description' content='User Profile of the Shopee Clone project' />
        </Helmet>

        <div className='container'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-12'>
            <div className='md:col-span-3 lg:col-span-2'>
              <UserSideNav />
            </div>

            <div className='md:col-span-9 lg:col-span-10'>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserLayout

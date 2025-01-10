import Input from '../../../../components/Input'

const Profile = () => {
  return (
    <>
      <div className='bg-white rounded-sm px-7 pb-20 shadow'>
        <div className='border-b border-b-gray-200 py-6'>
          <h1 className='text-lg font-medium capitalize text-gray-900'>My profile</h1>

          <div className='mt-1 text-sm text-gray-700'>Manage profile information for account security</div>
        </div>

        <div className='mt-8 flex flex-col-reverse md:flex-row md:items-start'>
          <form className='mt-6 flex-grow md:mt-0 md:pr-12'>
            <div className='flex flex-col flex-wrap sm:flex-row'>
              <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Email</div>
              <div className='sm:w-[80%] sm:pl-5'>
                <div className='pt-3 text-gray-700'>pv*****@gmail.com</div>
              </div>
            </div>

            <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
              <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Name</div>
              <div className='sm:w-[80%] sm:pl-5'>
                <Input classNameInput='w-full rounded-sm border- border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm' />
              </div>
            </div>

            <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
              <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Phone</div>
              <div className='sm:w-[80%] sm:pl-5'>
                <Input classNameInput='w-full rounded-sm border- border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm' />
              </div>
            </div>

            <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
              <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Email</div>
              <div className='sm:w-[80%] sm:pl-5'>
                <Input classNameInput='w-full rounded-sm border- border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm' />
              </div>
            </div>

            <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
              <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Date of birth</div>
              <div className='sm:w-[80%] sm:pl-5'>
                <div className='flex justify-between'>
                  <select className='h-10 w-[32%] rounded-sm border border-black/10 px-3'>
                    <option disabled>Day</option>
                  </select>

                  <select className='h-10 w-[32%] rounded-sm border border-black/10 px-3'>
                    <option disabled>Month</option>
                  </select>

                  <select className='h-10 w-[32%] rounded-sm border border-black/10 px-3'>
                    <option disabled>Year</option>
                  </select>
                </div>
              </div>
            </div>
          </form>

          <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
            <div className='flex flex-col items-center'>
              <div className='my-5 h-24 w-24'>
                <img src='/avatar.svg' alt='Avatar' className='w-full h-full rounded-full object-cover' />
              </div>

              <input type='file' accept='.jpg,.jpeg,.png' className='hidden' />

              <button className='flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm'>
                Change avatar
              </button>

              <div className='mt-3 text-gray-400'>
                <div>Maximum file size: 1MB</div>
                <div>Format: .jpg, .jpeg, .png</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile

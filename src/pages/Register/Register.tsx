import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { getRules } from '../../utils/rules'

interface FormData {
  email: string
  password: string
  confirm_password: string
}

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors }
  } = useForm<FormData>()

  const rules = getRules(getValues)

  const onSubmit = handleSubmit(
    (data) => {
      console.log(data)
    },
    (data) => {
      const password = getValues('password')

      console.log('Password', password)
    }
  )

  // const formValues = watch('password')
  // console.log('Password', formValues)

  // console.log('errors', errors)

  return (
    <>
      <div className='bg-orange'>
        <div className='container'>
          <div className='grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-32 lg:pr-10'>
            <div className='lg:col-span-2 lg:col-start-4'>
              <form className='p-10 rounded bg-white shadow-sm' onSubmit={onSubmit} noValidate>
                <div className='text-2xl'>Sign Up</div>

                <div className='mt-8'>
                  <input
                    type='email'
                    className='p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    placeholder='Email'
                    {...register('email', rules.email)}
                  />

                  <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm'>{errors.email?.message}</div>
                </div>

                <div className='mt-2'>
                  <input
                    type='password'
                    autoComplete='on'
                    className='p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    placeholder='Password'
                    {...register('password', rules.password)}
                  />

                  <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm'>{errors.password?.message} </div>
                </div>

                <div className='mt-2'>
                  <input
                    type='password'
                    autoComplete='on'
                    className='p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    placeholder='Confirm Password'
                    {...register('confirm_password', {
                      ...rules.confirm_password
                    })}
                  />

                  <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm'>{errors.confirm_password?.message} </div>
                </div>

                <div className='mt-2'>
                  <button
                    type='submit'
                    className='w-full text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600'
                  >
                    Sign Up
                  </button>
                </div>

                <div className='mt-8'>
                  <div className='flex items-center justify-center gap-2'>
                    <span className='text-gray-400'>Already have an account?</span>

                    <Link className='text-red-400' to='/login'>
                      Log In
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register

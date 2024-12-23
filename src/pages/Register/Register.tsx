import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { getRules } from '../../utils/rules'
import Input from '../../components/Input'

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

                <Input
                  name='email'
                  register={register}
                  type='email'
                  className='mt-8'
                  placeholder='Email'
                  errorMessage={errors.email?.message}
                  rules={rules.email}
                  autoComplete='on'
                />

                <Input
                  name='password'
                  register={register}
                  type='password'
                  className='mt-2'
                  placeholder='Password'
                  errorMessage={errors.password?.message}
                  rules={rules.password}
                  autoComplete='on'
                />

                <Input
                  name='confirm_password'
                  register={register}
                  type='password'
                  className='mt-2'
                  placeholder='Confirm Password'
                  errorMessage={errors.confirm_password?.message}
                  rules={rules.confirm_password}
                  autoComplete='on'
                />

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

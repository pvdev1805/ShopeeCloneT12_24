import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { Schema, schema } from '../../utils/rules'
import { omit } from 'lodash'
import Input from '../../components/Input'
import { registerAccount } from '../../apis/auth.api'
import { isAxiosUnprocessableEntityError } from '../../utils/utils'
import { ErrorResponse } from '../../types/utils.type'
import { useContext } from 'react'
import { AppContext } from '../../contexts/app.context'
import Button from '../../components/Button'

type FormData = Schema

const Register = () => {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    setError,
    getValues,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  })

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => registerAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    // console.log(data)
    const body = omit(data, ['confirm_password'])
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        // console.log('data', data)
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data

          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, 'confirm_password'>, {
                message: formError[key as keyof Omit<FormData, 'confirm_password'>],
                type: 'Server'
              })
            })
          }

          // if (formError?.email) {
          //   setError('email', {
          //     message: formError.email,
          //     type: 'Server'
          //   })
          // }

          // if (formError?.password) {
          //   setError('password', {
          //     message: formError.password,
          //     type: 'Server'
          //   })
          // }
        }

        console.log('error', error)
      }
    })
  })

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
                  autoComplete='on'
                />

                <Input
                  name='password'
                  register={register}
                  type='password'
                  className='mt-2'
                  placeholder='Password'
                  errorMessage={errors.password?.message}
                  autoComplete='on'
                />

                <Input
                  name='confirm_password'
                  register={register}
                  type='password'
                  className='mt-2'
                  placeholder='Confirm Password'
                  errorMessage={errors.confirm_password?.message}
                  autoComplete='on'
                />

                <div className='mt-2'>
                  <Button
                    type='submit'
                    className='w-full text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600 flex justify-center items-center'
                    isLoading={registerAccountMutation.isPending}
                    disabled={registerAccountMutation.isPending}
                  >
                    Sign Up
                  </Button>
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

import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Schema, schema } from '../../utils/rules'
import { useMutation } from '@tanstack/react-query'
import { login } from '../../apis/auth.api'
import { isAxiosUnprocessableEntityError } from '../../utils/utils'
import { ErrorResponse } from '../../types/utils.type'
import Input from '../../components/Input'
import { useContext } from 'react'
import { AppContext } from '../../contexts/app.context'
import Button from '../../components/Button'

type FormData = Omit<Schema, 'confirm_password'>
const loginSchema = schema.omit(['confirm_password'])

const Login = () => {
  const { setIsAuthenticated } = useContext(AppContext)

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })

  const loginMutation = useMutation({
    mutationFn: (body: FormData) => login(body)
  })

  const onSubmit = handleSubmit((data) => {
    // console.log(data)
    const body = data
    loginMutation.mutate(body, {
      onSuccess: () => {
        // console.log('data', data)
        setIsAuthenticated(true)
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
          const formError = error.response?.data.data

          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
                type: 'Server'
              })
            })
          }
        }

        console.log('error', error)
      }
    })
  })

  return (
    <>
      <div className='bg-orange'>
        <div className='container'>
          <div className='grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-32 lg:pr-10'>
            <div className='lg:col-span-2 lg:col-start-4'>
              <form className='p-10 rounded bg-white shadow-sm' onSubmit={onSubmit} noValidate>
                <div className='text-2xl'>Login</div>

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

                <div className='mt-3'>
                  <Button
                    type='submit'
                    className='w-full text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600 flex justify-center items-center'
                    isLoading={loginMutation.isPending}
                    disabled={loginMutation.isPending}
                  >
                    Login
                  </Button>
                </div>

                <div className='mt-8'>
                  <div className='flex items-center justify-center gap-2'>
                    <span className='text-gray-400'>Don't have an account?</span>

                    <Link className='text-red-400' to='/register'>
                      Sign Up
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

export default Login

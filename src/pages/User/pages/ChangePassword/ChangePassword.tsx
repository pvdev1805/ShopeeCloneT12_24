import { useForm } from 'react-hook-form'
import Button from '../../../../components/Button'
import Input from '../../../../components/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import { userSchema, UserSchema } from '../../../../utils/rules'
import { useMutation } from '@tanstack/react-query'
import userApi from '../../../../apis/user.api'
import { toast } from 'react-toastify'
import omit from 'lodash/omit'
import { isAxiosUnprocessableEntityError } from '../../../../utils/utils'
import { ErrorResponse } from '../../../../types/utils.type'
import { useTranslation } from 'react-i18next'

type FormData = Pick<UserSchema, 'password' | 'new_password' | 'confirm_password'>
const passwordSchema = userSchema.pick(['password', 'new_password', 'confirm_password'])

const ChangePassword = () => {
  const { t } = useTranslation('user')

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    reset
  } = useForm<FormData>({
    defaultValues: {
      password: '',
      new_password: '',
      confirm_password: ''
    },
    resolver: yupResolver(passwordSchema)
  })

  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await updateProfileMutation.mutateAsync(omit(data, ['confirm_password']))
      toast.success(res.data.message)
      reset()
    } catch (error) {
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
    }
  })

  return (
    <>
      <div className='bg-white rounded-sm px-2 pb-10 md:px-7 md:pb-20 shadow'>
        <div className='border-b border-b-gray-200 py-6'>
          <h1 className='text-lg font-medium capitalize text-gray-900'>{t('change password.title')}</h1>

          <div className='mt-1 text-sm text-gray-700'>{t('change password.description')}</div>
        </div>

        <form className='mt-8 mr-auto max-w-2xl' onSubmit={onSubmit}>
          <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
            <div className='flex flex-col flex-wrap sm:flex-row'>
              <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>
                {t('change password.labels.current password')}
              </div>
              <div className='sm:w-[80%] sm:pl-5'>
                <Input
                  classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                  className='relative'
                  register={register}
                  name='password'
                  type='password'
                  placeholder={t('change password.placeholders.current password')}
                  errorMessage={errors.password?.message}
                />
              </div>
            </div>

            <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
              <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>
                {t('change password.labels.new password')}
              </div>
              <div className='sm:w-[80%] sm:pl-5'>
                <Input
                  classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                  className='relative'
                  register={register}
                  name='new_password'
                  type='password'
                  placeholder={t('change password.placeholders.new password')}
                  errorMessage={errors.new_password?.message}
                />
              </div>
            </div>

            <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
              <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>
                {t('change password.labels.confirm password')}
              </div>
              <div className='sm:w-[80%] sm:pl-5'>
                <Input
                  classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                  className='relative'
                  register={register}
                  name='confirm_password'
                  type='password'
                  placeholder={t('change password.placeholders.confirm password')}
                  errorMessage={errors.confirm_password?.message}
                />
              </div>
            </div>

            <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
              <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'></div>
              <div className='sm:w-[80%] sm:pl-5'>
                <Button
                  type='submit'
                  className='flex items-center rounded-sm h-9 bg-orange px-5 text-center text-sm text-white hover:bg-orange/80'
                >
                  {t('buttons.save')}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default ChangePassword

import { useMutation, useQuery } from '@tanstack/react-query'
import Button from '../../../../components/Button'
import Input from '../../../../components/Input'
import userApi from '../../../../apis/user.api'
import { userSchema, UserSchema } from '../../../../utils/rules'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import InputNumber from '../../../../components/InputNumber'
import { useContext, useEffect, useMemo, useState } from 'react'
import DateSelect from '../../components/DateSelect'
import { toast } from 'react-toastify'
import { AppContext } from '../../../../contexts/app.context'
import { setProfileToLS } from '../../../../utils/auth'
import { getAvatarUrl, isAxiosUnprocessableEntityError } from '../../../../utils/utils'
import { ErrorResponse } from '../../../../types/utils.type'
import InputFile from '../../../../components/InputFile'

type FormData = Pick<UserSchema, 'name' | 'address' | 'phone' | 'avatar' | 'date_of_birth'>

type FormDataError = Omit<FormData, 'date_of_birth'> & {
  date_of_birth?: string
}

const profileSchema = userSchema.pick(['name', 'address', 'phone', 'avatar', 'date_of_birth'])

const Profile = () => {
  const { setProfile } = useContext(AppContext)

  const [file, setFile] = useState<File>()

  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : ''
  }, [file])

  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getProfile
  })

  const profile = profileData?.data.data

  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile
  })

  const uploadAvatarMutation = useMutation({
    mutationFn: userApi.uploadAvatar
  })

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    setError
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      avatar: '',
      date_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver(profileSchema)
  })

  const avatar = watch('avatar')

  useEffect(() => {
    if (profile) {
      setValue('name', profile.name)
      setValue('phone', profile.phone)
      setValue('address', profile.address)
      setValue('avatar', profile.avatar)
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1))
    }
  }, [profile, setValue])

  const onSubmit = handleSubmit(async (data) => {
    console.log(data)

    try {
      let avatarName = avatar
      if (file) {
        const form = new FormData()

        form.append('image', file)
        const uploadRes = await uploadAvatarMutation.mutateAsync(form)
        // console.log(uploadRes.data.data)
        avatarName = uploadRes.data.data
        setValue('avatar', avatarName)
      }

      const res = await updateProfileMutation.mutateAsync({
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        avatar: avatarName
      })
      setProfile(res.data.data)
      setProfileToLS(res.data.data)
      refetch()
      toast.success(res.data.message)
    } catch (error) {
      // console.log(error)
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormDataError>>(error)) {
        const formError = error.response?.data.data

        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormDataError, {
              message: formError[key as keyof FormDataError],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  const handleChangeFile = (file: File) => {
    setFile(file)
  }

  return (
    <>
      <div className='bg-white rounded-sm px-7 pb-20 shadow'>
        <div className='border-b border-b-gray-200 py-6'>
          <h1 className='text-lg font-medium capitalize text-gray-900'>My profile</h1>

          <div className='mt-1 text-sm text-gray-700'>Manage profile information for account security</div>
        </div>

        <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start' onSubmit={onSubmit}>
          <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
            <div className='flex flex-col flex-wrap sm:flex-row'>
              <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Email</div>
              <div className='sm:w-[80%] sm:pl-5'>
                <div className='pt-3 text-gray-700'>{profile?.email}</div>
              </div>
            </div>

            <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
              <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Name</div>
              <div className='sm:w-[80%] sm:pl-5'>
                <Input
                  classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                  register={register}
                  name='name'
                  placeholder='Name'
                  errorMessage={errors.name?.message}
                />
              </div>
            </div>

            <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
              <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Phone</div>
              <div className='sm:w-[80%] sm:pl-5'>
                <Controller
                  control={control}
                  name='phone'
                  render={({ field }) => (
                    <InputNumber
                      classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                      placeholder='Phone'
                      errorMessage={errors.phone?.message}
                      {...field}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>

            <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
              <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Address</div>
              <div className='sm:w-[80%] sm:pl-5'>
                <Input
                  classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                  register={register}
                  name='address'
                  placeholder='Address'
                  errorMessage={errors.address?.message}
                />
              </div>
            </div>

            <Controller
              control={control}
              name='date_of_birth'
              render={({ field }) => (
                <DateSelect
                  errorMessage={errors.date_of_birth?.message}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
              <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'></div>
              <div className='sm:w-[80%] sm:pl-5'>
                <Button
                  type='submit'
                  className='flex items-center rounded-sm h-9 bg-orange px-5 text-center text-sm text-white hover:bg-orange/80'
                >
                  Save
                </Button>
              </div>
            </div>
          </div>

          <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
            <div className='flex flex-col items-center'>
              <div className='my-5 h-24 w-24'>
                <img
                  src={previewImage || getAvatarUrl(avatar)}
                  alt='Avatar'
                  className='w-full h-full rounded-full object-cover'
                />
              </div>

              <InputFile onChange={handleChangeFile} />

              <div className='mt-3 text-gray-400'>
                <div>Maximum file size: 1MB</div>
                <div>Format: .jpg, .jpeg, .png</div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default Profile

import { useRef } from 'react'
import { toast } from 'react-toastify'
import config from '../../constants/config'
import { useTranslation } from 'react-i18next'

interface Props {
  onChange?: (file: File) => void
}

const InputFile = ({ onChange }: Props) => {
  const { t } = useTranslation('user')

  const fileInputRef = useRef<HTMLInputElement>(null)

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0]

    fileInputRef.current?.setAttribute('value', '')
    if (fileFromLocal && (fileFromLocal.size >= config.maxSizeUploadAvatar || !fileFromLocal.type.includes('image'))) {
      toast.error(`Maximum file size: 1MB\nFormat: .jpg, .jpeg, .png`, {
        position: 'top-center'
      })
    } else {
      onChange && onChange(fileFromLocal as File)
    }
  }

  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <input
        type='file'
        accept='.jpg,.jpeg,.png'
        className='hidden'
        ref={fileInputRef}
        onChange={onFileChange}
        onClick={(event) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(event.target as any).value = null
        }}
      />

      <button
        type='button'
        className='flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm'
        onClick={handleUpload}
      >
        {t('profile.avatar.title')}
      </button>
    </>
  )
}

export default InputFile

import range from 'lodash/range'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  onChange?: (value: Date) => void
  value?: Date
  errorMessage?: string
}

const DateSelect = ({ onChange, value, errorMessage }: Props) => {
  const { t } = useTranslation('user')

  const [date, setDate] = useState({
    date: value?.getDate() || 1,
    month: value?.getMonth() || 0,
    year: value?.getFullYear() || 1990
  })

  useEffect(() => {
    if (value) {
      setDate({
        date: value.getDate(),
        month: value.getMonth(),
        year: value.getFullYear()
      })
    }
  }, [value])

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value: valueFromSelect, name } = event.target
    const newDate = {
      date: value?.getDate() || date.date,
      month: value?.getMonth() || date.month,
      year: value?.getFullYear() || date.year,
      [name]: Number(valueFromSelect)
    }

    setDate(newDate)
    onChange && onChange(new Date(newDate.year, newDate.month, newDate.date))
  }

  return (
    <>
      <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
        <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>{t('profile.labels.date of birth')}</div>
        <div className='sm:w-[80%] sm:pl-5'>
          <div className='flex justify-between'>
            <select
              name='date'
              onChange={handleChange}
              className='h-10 w-[32%] rounded-sm border border-black/10 px-3 cursor-pointer hover:border-orange'
              value={value?.getDate() || date.date}
            >
              <option disabled>{t('profile.labels.date')}</option>
              {range(1, 32).map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              name='month'
              onChange={handleChange}
              className='h-10 w-[32%] rounded-sm border border-black/10 px-3 cursor-pointer hover:border-orange'
              value={value?.getMonth() || date.month}
            >
              <option disabled>{t('profile.labels.month')}</option>
              {range(0, 12).map((item) => (
                <option value={item} key={item}>
                  {item + 1}
                </option>
              ))}
            </select>

            <select
              name='year'
              onChange={handleChange}
              className='h-10 w-[32%] rounded-sm border border-black/10 px-3 cursor-pointer hover:border-orange'
              value={value?.getFullYear() || date.year}
            >
              <option disabled>{t('profile.labels.year')}</option>
              {range(1990, new Date().getFullYear() + 1).map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm'>{errorMessage}</div>
        </div>
      </div>
    </>
  )
}

export default DateSelect

import type { RegisterOptions, UseFormGetValues } from 'react-hook-form'
import * as yup from 'yup'

type Rules = {
  [key in 'email' | 'password' | 'confirm_password']?: RegisterOptions
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  email: {
    required: {
      value: true,
      message: 'Email is required'
    },
    pattern: {
      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      message: 'Invalid email format'
    },
    maxLength: {
      value: 160,
      message: 'Must be between 5 and 160 characters long'
    },
    minLength: {
      value: 5,
      message: 'Must be between 5 and 160 characters long'
    }
  },
  password: {
    required: {
      value: true,
      message: 'Password is required'
    },
    maxLength: {
      value: 160,
      message: 'Must be between 6 and 160 characters long'
    },
    minLength: {
      value: 6,
      message: 'Must be between 6 and 160 characters long'
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: 'Confirm Password is required'
    },
    maxLength: {
      value: 160,
      message: 'Must be between 6 and 160 characters long'
    },
    minLength: {
      value: 6,
      message: 'Must be between 6 and 160 characters long'
    },
    validate:
      typeof getValues === 'function'
        ? (value) => value === getValues('password') || 'The passwords do not match'
        : undefined
  }
})

function testPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
  const { price_max, price_min } = this.parent as { price_max: string; price_min: string }
  if (price_min !== '' && price_max !== '') {
    return Number(price_max) >= Number(price_min)
  }

  return price_min !== '' || price_max !== ''
}

const handleConfirmPasswordYup = (refString: string) => {
  return yup
    .string()
    .required('Confirm Password is required')
    .min(6, 'Must be between 6 and 160 characters long')
    .max(160, 'Must be between 6 and 160 characters long')
    .oneOf([yup.ref(refString)], 'The passwords do not match')
}

export const schema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format')
    .min(5, 'Must be between 5 and 160 characters long')
    .max(160, 'Must be between 5 and 160 characters long'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Must be between 6 and 160 characters long')
    .max(160, 'Must be between 6 and 160 characters long'),
  confirm_password: handleConfirmPasswordYup('password'),
  price_min: yup.string().test({
    name: 'price-not-allowed',
    message: 'Price is invalid',
    test: testPriceMinMax
  }),
  price_max: yup.string().test({
    name: 'price-not-allowed',
    message: 'Price is invalid',
    test: testPriceMinMax
  }),
  name: yup.string().trim().required('Product name is required')
})

export const userSchema = yup.object({
  name: yup.string().max(160, 'Maximum 160 characters'),
  phone: yup.string().max(20, 'Maximum 20 characters'),
  address: yup.string().max(160, 'Maximum 160 characters'),
  avatar: yup.string().max(1000, 'Maximum 1000 characters'),
  date_of_birth: yup.date().max(new Date(), 'Select a date in the past'),
  password: schema.fields['password'] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  new_password: schema.fields['password'] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  confirm_password: handleConfirmPasswordYup('new_password') as yup.StringSchema<
    string | undefined,
    yup.AnyObject,
    undefined,
    ''
  >
})

export type UserSchema = yup.InferType<typeof userSchema>

export type Schema = yup.InferType<typeof schema>

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
  confirm_password: yup
    .string()
    .required('Confirm Password is required')
    .min(6, 'Must be between 6 and 160 characters long')
    .max(160, 'Must be between 6 and 160 characters long')
    .oneOf([yup.ref('password')], 'The passwords do not match'),
  price_min: yup.string().test({
    name: 'price-not-allowed',
    message: 'Price is invalid',
    test: testPriceMinMax
  }),
  price_max: yup.string().test({
    name: 'price-not-allowed',
    message: 'Price is invalid',
    test: testPriceMinMax
  })
})

export type Schema = yup.InferType<typeof schema>

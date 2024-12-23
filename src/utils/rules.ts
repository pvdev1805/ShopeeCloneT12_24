import type { RegisterOptions } from 'react-hook-form'

type Rules = {
  [key in 'email' | 'password' | 'confirm_password']?: RegisterOptions
}

export const rules: Rules = {
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
    }
  }
}

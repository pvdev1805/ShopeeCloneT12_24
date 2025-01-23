import { beforeAll, describe, expect, it } from 'vitest'
import { renderWithRouter } from '../../utils/testUtils'
import path from '../../constants/path'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

describe('Login', () => {
  let emailInput: HTMLInputElement
  let passwordInput: HTMLInputElement
  let submitButton: HTMLButtonElement

  beforeAll(async () => {
    renderWithRouter({ route: path.login })
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Email')).toBeInTheDocument()
    })

    emailInput = document.querySelector('form input[type="email"]') as HTMLInputElement
    passwordInput = document.querySelector('form input[type="password"]') as HTMLInputElement
    submitButton = document.querySelector('form button[type="submit"]') as HTMLButtonElement
  })

  it('Display error: Required when user does not enter anything', async () => {
    fireEvent.submit(submitButton)

    await waitFor(() => {
      expect(screen.queryByText('Email is required')).toBeTruthy()
      expect(screen.queryByText('Password is required')).toBeTruthy()
    })
  })

  it('Display error message when user enters wrong pattern in format of input value', async () => {
    fireEvent.change(emailInput, {
      target: {
        value: 'test@mail'
      }
    })
    fireEvent.change(passwordInput, {
      target: {
        value: '123'
      }
    })
    fireEvent.submit(submitButton)

    await waitFor(() => {
      expect(screen.queryByText('Invalid email format')).toBeTruthy()
      expect(screen.queryByText('Must be between 5 and 160 characters long')).toBeTruthy()
    })
  })

  it('Do not display error message when user enters correct pattern in format of input value', async () => {
    fireEvent.change(emailInput, {
      target: {
        value: 'd3@gmail.com'
      }
    })
    fireEvent.change(passwordInput, {
      target: {
        value: 'useruser'
      }
    })

    await waitFor(() => {
      expect(screen.queryByText('Invalid email format')).toBeFalsy()
      expect(screen.queryByText('Must be between 5 and 160 characters long')).toBeFalsy()
    })
    fireEvent.submit(submitButton)

    await waitFor(() => {
      expect(document.querySelector('title')?.textContent).toBe('Login | Shopee Clone')
    })
  })
})

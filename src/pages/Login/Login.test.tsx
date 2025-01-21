import { beforeAll, describe, expect, it } from 'vitest'
import { logScreen, renderWithRouter } from '../../utils/testUtils'
import path from '../../constants/path'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

describe('Login', () => {
  beforeAll(async () => {
    renderWithRouter({ route: path.login })
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Email')).toBeInTheDocument()
    })
  })

  it('Display error: Required when user does not enter anything', async () => {
    const submitButton = document.querySelector('form button[type="submit"]') as HTMLButtonElement
    fireEvent.submit(submitButton)

    await waitFor(async () => {
      expect(await screen.findByText('Email is required')).toBeTruthy()
      expect(await screen.findByText('Password is required')).toBeTruthy()
    })

    // await logScreen()
  })

  it('Display error: Required when user does not enter anything', async () => {
    const emailInput = document.querySelector('form input[type="email"]') as HTMLInputElement
    const passwordInput = document.querySelector('form input[type="password"]') as HTMLInputElement
    const submitButton = document.querySelector('form button[type="submit"]') as HTMLButtonElement

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
      expect(screen.findByText('Invalid email format')).toBeTruthy()
      expect(screen.findByText('Must be between 5 and 160 characters long')).toBeTruthy()
    })

    await logScreen()
  })
})

import { describe, expect, test } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { renderWithRouter } from './utils/testUtils'
import path from './constants/path'

describe('App', () => {
  test('App renders and redirects to other page', async () => {
    const { user } = renderWithRouter()

    // Verify: redirect to the correct homepage
    await waitFor(() => {
      expect(document.querySelector('title')?.textContent).toBe('Homepage | Shopee Clone')
    })

    // Verify: redirect to Login page
    await user.click(screen.getByText(/login/i))
    await waitFor(() => {
      expect(screen.queryByText(`Don't have an account?`)).toBeInTheDocument()
      expect(document.querySelector('title')?.textContent).toBe('Login | Shopee Clone')
    })

    // await waitFor(
    //   () => {
    //     expect(document.head.querySelector('title')).toBeTruthy()
    //   },
    //   {
    //     timeout: 1000
    //   }
    // )

    // Log
    // screen.debug(document.body.parentElement as HTMLElement, 999999)
  })

  test('Redirect to Page Not Found', async () => {
    const badRoute = '/some/bad/route'

    renderWithRouter({ route: badRoute })

    await waitFor(() => {
      expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument()
    })

    // screen.debug(document.body.parentElement as HTMLElement, 999999)
  })

  test('Render the register page', async () => {
    renderWithRouter({ route: path.register })
    await waitFor(() => {
      expect(screen.getByText(/Already have an account?/i)).toBeInTheDocument()
    })
  })
})

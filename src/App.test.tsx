import { describe, expect, test } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import App from './App'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import { logScreen } from './utils/testUtils'

describe('App', () => {
  test('App renders and redirects to other page', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )

    const user = userEvent.setup()

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
    render(
      <MemoryRouter initialEntries={[badRoute]}>
        <App />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument()
    })

    // screen.debug(document.body.parentElement as HTMLElement, 999999)

    await logScreen()
  })
})

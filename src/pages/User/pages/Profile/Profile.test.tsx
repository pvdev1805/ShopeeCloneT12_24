import { describe, expect, it } from 'vitest'
import { setAccessTokenToLS } from '../../../../utils/auth'
import { access_token } from '../../../../msw/auth.msw'
import { renderWithRouter } from '../../../../utils/testUtils'
import path from '../../../../constants/path'
import { waitFor } from '@testing-library/react'

describe('Profile', () => {
  it('Display User Profile page', async () => {
    setAccessTokenToLS(access_token)
    const { container } = renderWithRouter({ route: path.profile })
    // await logScreen()
    await waitFor(() => {
      expect((container.querySelector('form input[placeholder="Tên"]') as HTMLInputElement).value).toBe('Dư Thanh Được')
    })
  })
})

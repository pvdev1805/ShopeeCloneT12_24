import { afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import authRequests from './src/msw/auth.msw.ts'
import productRequests from './src/msw/product.msw.ts'
import userRequests from './src/msw/user.msw.ts'

const server = setupServer(...authRequests, ...productRequests, ...userRequests)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

//  Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers())

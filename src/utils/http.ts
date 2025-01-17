import axios, { AxiosError, type AxiosInstance } from 'axios'
import HttpStatusCode from '../constants/httpStatusCode.enum'
import { toast } from 'react-toastify'
import { AuthResponse, RefreshTokenResponse } from '../types/auth.type'
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setProfileToLS,
  setRefreshTokenToLS
} from './auth'
import config from '../constants/config'
import { URL_LOGIN, URL_LOGOUT, URL_REFRESH_TOKEN, URL_REGISTER } from '../apis/auth.api'
import { isAxiosExpiredTokenError, isAxiosUnauthorizedError } from './utils'
import { ErrorResponse } from '../types/utils.type'

class Http {
  instance: AxiosInstance

  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null

  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.refreshToken = getRefreshTokenFromLS()
    this.refreshTokenRequest = null

    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'expire-access-token': 10, // 10 seconds
        'expire-refresh-token': 60 * 60 // 1 hour
      }
    })

    // Add a request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = this.accessToken
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Add a response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        // console.log(response)

        const { url } = response.config
        if (url === URL_LOGIN || url === URL_REGISTER) {
          const data = response.data as AuthResponse

          this.accessToken = data.data.access_token
          this.refreshToken = data.data.refresh_token

          setAccessTokenToLS(this.accessToken)
          setRefreshTokenToLS(this.refreshToken)

          setProfileToLS(data.data.user)
        } else if (url === URL_LOGOUT) {
          this.accessToken = ''
          this.refreshToken = ''
          clearLS()
        }

        return response
      },
      (error: AxiosError) => {
        // Only use toast to show error message
        // when the status code is not 422 (Unprocessable Entity) or 401 (Unauthorized)
        if (
          ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status as number)
        ) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data
          const message = data?.message || error.message
          toast.error(message)
        }

        // Error code 401: Unauthorized happens when
        // - The token is invalid (incorrect, expired, etc.)
        // - Not passing the token
        // - The token is expired*

        // If the error code is 401
        if (isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error)) {
          const config = error.response?.config || { headers: {}, url: '' }
          const { url } = config
          // Case: If the token is expired and the request is not a refresh token request,
          // we will refresh the token
          console.log(config)
          if (isAxiosExpiredTokenError(error) && url !== URL_REFRESH_TOKEN) {
            // Reduce the chance of calling handleRefreshToken 2 times
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  // Hold the request for 10 seconds in case any next requests have 401 error, could also use a queue here
                  // This is to avoid calling multiple new token requests
                  setTimeout(() => {
                    this.refreshTokenRequest = null
                  }, 10000)
                })
            return this.refreshTokenRequest.then((access_token) => {
              // Retry the request with the new token
              // At this point, the request will be sent again with the new token
              return this.instance({ ...config, headers: { ...config.headers, authorization: access_token } })
            })
          }

          // Case: If the problem happens when
          // - The token is invalid (incorrect)
          // - Not passing the token
          // - The token is expired* but calling the refresh token API is failed
          // --> We will clear the local storage and toast the error message
          clearLS()
          this.accessToken = ''
          this.refreshToken = ''
          toast.error(error.response?.data.data?.message || error.response?.data.message)
          // window.location.reload()
        }

        return Promise.reject(error)
      }
    )
  }

  private handleRefreshToken = () => {
    return this.instance
      .post<RefreshTokenResponse>(URL_REFRESH_TOKEN, {
        refresh_token: this.refreshToken
      })
      .then((response) => {
        const { access_token } = response.data.data
        setAccessTokenToLS(access_token)
        this.accessToken = access_token
        return access_token
      })
      .catch((error) => {
        clearLS()
        this.accessToken = ''
        this.refreshToken = ''
        throw error
      })
  }
}

const http = new Http().instance

export default http

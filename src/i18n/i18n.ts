import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import HOME_EN from '../locales/en/home.json'
import PRODUCT_EN from '../locales/en/product.json'
import CART_EN from '../locales/en/cart.json'

import HOME_VI from '../locales/vi/home.json'
import PRODUCT_VI from '../locales/vi/product.json'
import CART_VI from '../locales/vi/cart.json'

export const locales = {
  en: 'English',
  vi: 'Tiếng Việt'
} as const

export const resources = {
  en: {
    home: HOME_EN,
    product: PRODUCT_EN,
    cart: CART_EN
  },
  vi: {
    home: HOME_VI,
    product: PRODUCT_VI,
    cart: CART_VI
  }
} as const

export const defaultNS = 'home'

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  ns: ['home', 'product', 'cart'],
  fallbackLng: 'en',
  defaultNS,
  interpolation: {
    escapeValue: false // react already safes from xss
  }
})

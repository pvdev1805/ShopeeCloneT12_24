import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import HOME_EN from '../locales/en/home.json'
import PRODUCT_EN from '../locales/en/product.json'
import CART_EN from '../locales/en/cart.json'
import USER_EN from '../locales/en/user.json'
import LOGIN_EN from '../locales/en/login.json'
import REGISTER_EN from '../locales/en/register.json'

import HOME_VI from '../locales/vi/home.json'
import PRODUCT_VI from '../locales/vi/product.json'
import CART_VI from '../locales/vi/cart.json'
import USER_VI from '../locales/vi/user.json'
import LOGIN_VI from '../locales/vi/login.json'
import REGISTER_VI from '../locales/vi/register.json'

import HOME_ZH from '../locales/zh/home.json'
import PRODUCT_ZH from '../locales/zh/product.json'
import CART_ZH from '../locales/zh/cart.json'
import USER_ZH from '../locales/zh/user.json'
import LOGIN_ZH from '../locales/zh/login.json'
import REGISTER_ZH from '../locales/zh/register.json'

import HOME_PT from '../locales/pt/home.json'
import PRODUCT_PT from '../locales/pt/product.json'
import CART_PT from '../locales/pt/cart.json'
import USER_PT from '../locales/pt/user.json'
import LOGIN_PT from '../locales/pt/login.json'
import REGISTER_PT from '../locales/pt/register.json'

export const locales = {
  en: 'English',
  vi: 'Tiếng Việt',
  zh: '中文',
  pt: 'Português'
} as const

export const resources = {
  en: {
    home: HOME_EN,
    product: PRODUCT_EN,
    cart: CART_EN,
    user: USER_EN,
    login: LOGIN_EN,
    register: REGISTER_EN
  },
  vi: {
    home: HOME_VI,
    product: PRODUCT_VI,
    cart: CART_VI,
    user: USER_VI,
    login: LOGIN_VI,
    register: REGISTER_VI
  },
  zh: {
    home: HOME_ZH,
    product: PRODUCT_ZH,
    cart: CART_ZH,
    user: USER_ZH,
    login: LOGIN_ZH,
    register: REGISTER_ZH
  },
  pt: {
    home: HOME_PT,
    product: PRODUCT_PT,
    cart: CART_PT,
    user: USER_PT,
    login: LOGIN_PT,
    register: REGISTER_PT
  }
} as const

export const defaultNS = 'home'

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  ns: ['home', 'product', 'cart', 'user', 'login', 'register'],
  fallbackLng: 'en',
  defaultNS,
  interpolation: {
    escapeValue: false // react already safes from xss
  }
})

import 'i18next'
import { defaultNS, resources } from '../i18n/i18n'

declare module 'i18next' {
  // Inheritance (Add to type)
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS

    // prettier-ignore
    resources: typeof resources['en']
  }
}

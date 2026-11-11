import { LocaleProvider } from './i18n/LocaleProvider'
import { MiniAppPage } from './miniapp/MiniAppPage'

export default function App() {
  return (
    <LocaleProvider>
      <MiniAppPage />
    </LocaleProvider>
  )
}

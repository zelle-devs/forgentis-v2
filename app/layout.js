import './globals.css'
import GlobalEffects from './globalEffects/globalEffects'

export const metadata = {
  title: 'Forgentis - Digital Excellence',
  description: 'Premium Digital Experience',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <GlobalEffects>
          {children}
        </GlobalEffects>
      </body>
    </html>
  )
}
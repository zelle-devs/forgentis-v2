import './globals.css'
import GlobalEffects from './globalEffects/globalEffects'

export const metadata = {
  title: 'Forgentis Fabrication - Built on Precision',
  description: 'Built on Precision',
   icons: {
    icon: '/optimize/favicon-f.png',
  },
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
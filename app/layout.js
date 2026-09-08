import './globals.css'

export const metadata = {
  title: 'Forgentis - Digital Excellence',
  description: 'Premium Digital Experience',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
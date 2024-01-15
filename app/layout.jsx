import { Inter } from 'next/font/google'
import './globals.css'
import Header from "@/components/Header";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'NTUAflix',
  description: 'Movies and TV shows Database',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-bs-theme="dark" className="dark" >
      <body className={inter.className}>
        <Header/>
        <main>{children}</main>
        </body>
    </html>
  )
}



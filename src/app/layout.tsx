import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '桜並木駅前の整骨院 - 予約システム',
  description: '桜並木駅前の整骨院のオンライン予約システム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}
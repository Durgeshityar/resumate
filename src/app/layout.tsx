import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import { Inter } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import PremiumModal from '@/components/premium/premium-modal'
import Script from 'next/script'
import { SubscriptionProvider } from './(protected)/resumes/_components/subscription-client'

const inter = Inter({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Resumate - AI-Powered Resume Builder for Software Engineers',
    template: '%s | Resumate',
  },
  description:
    'Create professional, ATS-optimized resumes in minutes with our AI-powered resume builder. Land more interviews with tailored resumes for software engineers.',
  keywords: [
    'AI resume builder',
    'ATS-friendly resume',
    'tech resume generator',
    'software engineer resume',
    'professional resume builder',
    'resume AI',
    'resume optimization',
    'job application',
  ],
  authors: [
    {
      name: 'Durgesh Chandrakar',
      url: 'https://www.linkedin.com/in/durgesh-chandrakar-586a34267/',
    },
  ],
  creator: 'Durgesh Chandrakar',
  publisher: 'Resumate',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://resumate.sbs',
    siteName: 'Resumate',
    title: 'Resumate - AI-Powered Resume Builder for Software Engineers',
    description:
      'Create professional, ATS-optimized resumes in minutes with our AI-powered resume builder. Land more interviews with tailored resumes for software engineers.',
    images: [
      {
        url: 'https://resumate.sbs/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Resumate AI Resume Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resumate - AI-Powered Resume Builder for Software Engineers',
    description:
      'Create professional, ATS-optimized resumes in minutes with our AI-powered resume builder. Land more interviews with tailored resumes for software engineers.',
    creator: '@resumate',
    images: ['https://resumate.sbs/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verification_token',
    yandex: 'verification_token',
  },
  alternates: {
    canonical: 'https://resumate.sbs',
    languages: {
      'en-US': 'https://resumate.sbs',
    },
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  return (
    <SessionProvider session={session}>
      <SubscriptionProvider>
        <html lang="en">
          <head>
            <meta
              name="format-detection"
              content="telephone=no, date=no, email=no, address=no"
            />
            <link rel="icon" href="/favicon.ico" sizes="any" />
            <link
              rel="apple-touch-icon"
              href="/apple-icon.png"
              type="image/png"
              sizes="180x180"
            />
          </head>
          <body className={`${inter.className} antialiased`}>
            <NuqsAdapter>
              <Toaster />
              <PremiumModal />
              <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="beforeInteractive"
              />
              {children}
            </NuqsAdapter>
          </body>
        </html>
      </SubscriptionProvider>
    </SessionProvider>
  )
}

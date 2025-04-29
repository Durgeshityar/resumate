import type { Metadata } from 'next'

// SEO constants
const PAGE_TITLE = 'Resumate - AI-Powered Resume Builder for Software Engineers'
const PAGE_DESCRIPTION =
  'Create professional, ATS-optimized resumes in minutes with our AI-powered resume builder. Land more interviews with tailored resumes for software engineers.'
const KEYWORDS =
  'AI resume builder, resume generator, ATS-optimized resume, software engineer resume, job application, professional resume, resume optimization'

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: KEYWORDS,
  alternates: {
    canonical: 'https://resumate.ai',
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: 'https://resumate.ai',
    siteName: 'Resumate',
    images: [
      {
        url: 'https://resumate.ai/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Resumate AI Resume Builder',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ['https://resumate.ai/twitter-image.jpg'],
    creator: '@resumate',
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
  authors: [
    {
      name: 'Durgesh Chandrakar',
      url: 'https://www.linkedin.com/in/durgesh-chandrakar-586a34267/',
    },
  ],
  creator: 'Durgesh Chandrakar',
  publisher: 'Resumate',
  verification: {
    google: 'verification_token',
    yandex: 'verification_token',
  },
}

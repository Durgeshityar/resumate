import { Metadata } from 'next'

// SEO constants
const PAGE_TITLE = 'Resumate - AI-Powered Resume Builder for Software Engineers'
const PAGE_DESCRIPTION =
  'Create professional, ATS-optimized resumes in minutes with our AI-powered resume builder. Land more interviews with tailored resumes for software engineers.'
const KEYWORDS =
  'AI resume builder, resume generator, ATS-optimized resume, software engineer resume, job application, professional resume, resume optimization'

// Metadata for Next.js App Router
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
  },
  robots: {
    index: true,
    follow: true,
  },
}

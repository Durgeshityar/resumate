import type { Metadata } from 'next'

// Static metadata approach
export const metadata: Metadata = {
  title: 'Resumate - AI-Powered Resume Builder',
  description:
    'Create professional, ATS-optimized resumes with AI tools that get you hired.',
  keywords: ['resume builder', 'AI resume', 'job application', 'career tools'],
  openGraph: {
    title: 'Resumate - AI-Powered Resume Builder',
    description:
      'Create professional, ATS-optimized resumes with AI tools that get you hired.',
    images: ['/og-image.png'],
  },
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

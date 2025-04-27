'use client'

import { FileText, PlusSquare } from 'lucide-react'
import Link from 'next/link'

import { useSubscription } from '@/hooks/use-subscription'

interface HeroSectionProps {
  canCreate: boolean
  totalResumes: number
}

export default function HeroSection({
  canCreate,
  totalResumes,
}: HeroSectionProps) {
  const { subscriptionActions, isSubscribed } = useSubscription()

  return (
    <div className="relative isolate overflow-hidden rounded-3xl px-6 py-16 mb-12 text-center bg-gradient-to-tr from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900">
      {/* Decorative background blobs */}
      <div className="absolute inset-0 -z-10">
        <svg
          viewBox="0 0 1024 1024"
          className="absolute top-[-10%] left-[-10%] w-[60%] opacity-20 blur-3xl text-blue-300"
          fill="currentColor"
        >
          <circle cx="512" cy="512" r="512" />
        </svg>
        <svg
          viewBox="0 0 1024 1024"
          className="absolute bottom-[-10%] right-[-10%] w-[50%] opacity-20 blur-3xl text-indigo-300"
          fill="currentColor"
        >
          <polygon points="512,0 1024,1024 0,1024" />
        </svg>
      </div>
      <h1 className="mx-auto max-w-2xl text-5xl font-extrabold tracking-tight leading-tight text-gray-900 sm:text-6xl dark:text-white">
        Your Professional Journey, Amplified
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-gray-500 dark:text-gray-400">
        Generate top-tier resumes and cover letters in seconds powered by AI.
        You have crafted {totalResumes}{' '}
        {totalResumes === 1 ? 'resume' : 'resumes'} so far.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {canCreate ? (
          <Link
            href="/editor"
            className="inline-flex items-center rounded-full bg-black px-6 py-3 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:bg-white dark:text-black dark:hover:bg-gray-100"
          >
            <PlusSquare className="mr-2 h-5 w-5" />
            Create Resume
          </Link>
        ) : (
          <button
            onClick={subscriptionActions.openPremiumModal}
            className="inline-flex items-center rounded-full bg-black px-6 py-3 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:bg-white dark:text-black dark:hover:bg-gray-100"
          >
            <PlusSquare className="mr-2 h-5 w-5" />
            Create Resume
          </button>
        )}
        {isSubscribed ? (
          <Link
            href="/cover-letters"
            className="inline-flex items-center rounded-full bg-transparent px-6 py-3 text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:text-white dark:hover:bg-gray-800"
          >
            <FileText className="mr-2 h-5 w-5" />
            Cover Letter
          </Link>
        ) : (
          <button
            onClick={subscriptionActions.openPremiumModal}
            className="inline-flex items-center rounded-full bg-transparent px-6 py-3 text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:text-white dark:hover:bg-gray-800"
          >
            <FileText className="mr-2 h-5 w-5" />
            Cover Letter
          </button>
        )}
      </div>
    </div>
  )
}

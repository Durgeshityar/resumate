'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Github,
  ChevronRight,
  Star,
  Target,
  Edit,
  Award,
  Settings,
  Zap,
  MessageCircle,
  ThumbsUp,
  Clock,
  Briefcase,
  Sparkles,
} from 'lucide-react'

import Link from 'next/link'
import handlePayment from '@/lib/handle-payment'
import { PlanType } from '@prisma/client'
import { useCurrentUser } from '@/hooks/use-current-user'
import { toast } from 'sonner'

const MONTHLY_PRICE = 29
const LIFETIME_PRICE = 140
const SAVINGS_PERCENTAGE = Math.round(
  (1 - LIFETIME_PRICE / (MONTHLY_PRICE * 12)) * 100
)

const Logo = () => {
  return (
    <div className="relative h-8 w-8 mr-2">
      <div className="absolute inset-0 bg-white rounded-[2px]"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-black font-bold">R</span>
      </div>
    </div>
  )
}

function HomePage() {
  const user = useCurrentUser()
  const [isLoading, setIsLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch((err) => console.error('Manual play error:', err))
      }
    }
  }, [])

  const initiatePayment = async (planType: PlanType) => {
    try {
      setIsLoading(true)

      // Check if user is logged in
      if (!user) {
        toast.error('You must be logged in to make a purchase')
        return
      }

      // Pass the user to handlePayment
      await handlePayment({
        subscription: planType,
      })
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="border-b border-gray-800 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Logo />
            <span className="font-bold text-xl">Resumate</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white">
              Features
            </a>

            <a href="#pricing" className="text-gray-300 hover:text-white">
              Pricing
            </a>
            <a
              href="https://github.com/resumate"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white flex items-center"
            >
              <Github className="h-4 w-4 mr-1" />
              GitHub
            </a>
          </nav>
          <div>
            {user ? (
              <Link href="/resumes">
                <Button
                  variant="outline"
                  className="border-gray-700 text-black hover:text-white hover:bg-gray-800"
                >
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  className="border-gray-700 text-black hover:text-white hover:bg-gray-800"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section - Keeping as requested */}
        <section className="py-20 md:py-32 border-b border-gray-800">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center bg-gray-800 rounded-full px-3 py-1 text-xs text-gray-300 mb-6">
              <span className="bg-green-500 h-2 w-2 rounded-full mr-2"></span>
              Open-Source | Self-hostable | Privacy-Focused
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              AI-Powered Resumes <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500">
                That Gets You Hired
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
              Community-driven resume builder for software engineers with
              AI-powered optimization. Own your data, customize every template,
              and land your dream job.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              {user ? (
                <Link href="/resumes">
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-gray-200 transition-all w-full"
                  >
                    Create Your Resume
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/login">
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-gray-200 transition-all w-full"
                  >
                    Create Your Resume
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}

              <Button
                size="lg"
                variant="outline"
                className="border-gray-700 text-black hover:text-white hover:bg-gray-800 "
                asChild
              >
                <a
                  href="https://github.com/resumate"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-5 w-5" />
                  View on GitHub
                </a>
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Account required. Self-hosting available for complete data
              control.
            </p>
          </div>
        </section>

        {/* Value Proposition Section - Instead of User Stats */}
        <section className="py-16 border-b border-gray-800 overflow-hidden relative">
          <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full -top-48 -left-48 blur-3xl"></div>
          <div className="absolute w-96 h-96 bg-green-500/10 rounded-full -bottom-48 -right-48 blur-3xl"></div>

          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              <div className="bg-gray-900/60 backdrop-blur-sm p-8 rounded-lg border border-gray-800 transform transition-all hover:scale-105 hover:border-blue-500/50">
                <div className="mb-4 flex items-center">
                  <Clock className="h-6 w-6 text-blue-500 mr-3" />
                  <h3 className="text-xl font-semibold">5-Minute Resume</h3>
                </div>
                <p className="text-gray-300">
                  Create a professional, ATS-optimized resume in just 5 minutes
                  with our AI-powered tools.
                </p>
              </div>

              <div className="bg-gray-900/60 backdrop-blur-sm p-8 rounded-lg border border-gray-800 transform transition-all hover:scale-105 hover:border-green-500/50">
                <div className="mb-4 flex items-center">
                  <Briefcase className="h-6 w-6 text-green-500 mr-3" />
                  <h3 className="text-xl font-semibold">Interview Ready</h3>
                </div>
                <p className="text-gray-300">
                  Our AI algorithms ensure your resume passes ATS systems and
                  catches the human recruiter&apos;s eye.
                </p>
              </div>

              <div className="bg-gray-900/60 backdrop-blur-sm p-8 rounded-lg border border-gray-800 transform transition-all hover:scale-105 hover:border-purple-500/50">
                <div className="mb-4 flex items-center">
                  <Sparkles className="h-6 w-6 text-purple-500 mr-3" />
                  <h3 className="text-xl font-semibold">Stand Out</h3>
                </div>
                <p className="text-gray-300">
                  Don&apos;t blend in with cookie-cutter templates. Our AI helps
                  your unique skills and experiences shine.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Features - Rezi Style */}
        <section id="features" className="py-20 border-b border-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">
              The smartest AI for resume writing
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
              {/* Feature 1 */}
              <div className="flex flex-col">
                <div className="h-12 w-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
                  <Target className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">
                  AI Keyword Targeting
                </h3>
                <p className="text-gray-400 mb-6">
                  Instantly improve your chances of being selected for an
                  interview by optimizing your resume with keywords from the job
                  description.
                </p>
                <div className="mt-auto">
                  <div className="bg-gray-900 rounded-md p-6">
                    <p className="text-sm text-gray-300 mb-4">
                      Great work! You&apos;re ranking well for these keywords in
                      the job description:
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {[
                        'Strategic Planning',
                        'Project Management',
                        'Team Leadership',
                        'Data Analysis',
                        'Client Relations',
                      ].map((keyword) => (
                        <span
                          key={keyword}
                          className="bg-blue-900/30 text-blue-400 rounded-full px-3 py-1 text-xs"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col">
                <div className="h-12 w-12 bg-green-900/30 rounded-lg flex items-center justify-center mb-6">
                  <Edit className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">
                  AI Content Writer
                </h3>
                <p className="text-gray-400 mb-6">
                  AI writes metrics-driven resume content for you, focused on
                  the skills and experience that recruiters are actually looking
                  for.
                </p>
                <div className="mt-auto">
                  <div className="bg-gray-900 rounded-md p-6">
                    <p className="text-sm text-gray-300 mb-4">
                      What did you accomplish at the company?
                    </p>
                    <div className="bg-gray-800 rounded p-4 text-sm text-gray-300">
                      • Increased team productivity by 37% through
                      implementation of agile methodologies and streamlined
                      workflows
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col">
                <div className="h-12 w-12 bg-purple-900/30 rounded-lg flex items-center justify-center mb-6">
                  <Settings className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Design Control</h3>
                <p className="text-gray-400 mb-6">
                  Easily design a fully ATS-optimized resume in a few clicks.
                  Choose colors, formatting, font sizing, pictures, and more.
                </p>
                <div className="mt-auto">
                  <div className="bg-gray-900 rounded-md p-6 flex flex-wrap gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-500"></div>
                    <div className="h-8 w-8 rounded-full bg-green-500"></div>
                    <div className="h-8 w-8 rounded-full bg-purple-500"></div>
                    <div className="h-8 w-8 rounded-full bg-red-500"></div>
                    <div className="h-8 w-8 rounded-full bg-yellow-500"></div>
                    <div className="h-8 w-8 rounded-full bg-gray-500"></div>
                  </div>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex flex-col">
                <div className="h-12 w-12 bg-orange-900/30 rounded-lg flex items-center justify-center mb-6">
                  <Award className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Resumate Score</h3>
                <p className="text-gray-400 mb-6">
                  Get your resume rated across 23 key metrics that help you pass
                  Applicant Tracking Systems and impress recruiters.
                </p>
                <div className="mt-auto">
                  <div className="bg-gray-900 rounded-md p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">
                        Resume Score
                      </span>
                      <span className="text-sm font-bold text-white">
                        86/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-green-500 h-2.5 rounded-full"
                        style={{ width: '86%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials  */}
        <section className="py-20 border-b border-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">
              For Developers. By Developers.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Testimonial 1 */}
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">JD</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">John Doe</h4>
                    <p className="text-gray-400 text-sm">Software Engineer</p>
                  </div>
                </div>
                <p className="text-gray-300">
                  &quot;I was stuck in a job search loop for months before using
                  Resumate. After optimizing my resume with the AI tools, I got
                  three interview calls in the first week. Landed my dream job
                  within a month!&quot;
                </p>
                <div className="flex text-yellow-500 mt-4">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-900 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">SL</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Sarah Lee</h4>
                    <p className="text-gray-400 text-sm">Marketing Director</p>
                  </div>
                </div>
                <p className="text-gray-300">
                  &quot;The keyword targeting feature is incredible. I was able
                  to tailor my resume perfectly to each job application. The
                  resume score feedback helped me improve sections I didn&apos;t
                  even realize were weak.&quot;
                </p>
                <div className="flex text-yellow-500 mt-4">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
              </div>
            </div>

            <div className="mt-12 flex justify-center">
              <div className="inline-flex bg-gray-800 rounded-full p-1">
                <div className="h-2 w-8 bg-blue-500 rounded-full"></div>
                <div className="h-2 w-2 bg-gray-600 rounded-full mx-1"></div>
                <div className="h-2 w-2 bg-gray-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - Rezi Style */}
        <section className="py-20 border-b border-gray-800">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              It&apos;s never been easier to make your resume
            </h2>
            <p className="text-gray-400 mb-16 max-w-2xl mx-auto">
              Resumate makes it simple to create a professional, ATS-optimized
              resume in minutes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                  <Zap className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Create or Upload</h3>
                <p className="text-gray-400 text-sm">
                  Start fresh or upload your existing resume to enhance with our
                  AI tools.
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="h-16 w-16 bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                  <MessageCircle className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Optimization</h3>
                <p className="text-gray-400 text-sm">
                  Our AI analyzes job descriptions and optimizes your content
                  for the best match.
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="h-16 w-16 bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
                  <ThumbsUp className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Apply & Get Hired
                </h3>
                <p className="text-gray-400 text-sm">
                  Download your perfectly formatted resume and start landing
                  interviews.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Demo Section */}
        <section className="py-20 border-b border-gray-800 overflow-hidden relative">
          <div className="absolute w-96 h-96 bg-blue-500/5 rounded-full -right-48 top-48 blur-3xl"></div>

          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                See Resumate in Action
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Our intuitive AI-powered platform makes building a professional
                resume simple and fast. Watch how Resumate transforms your
                career information into an impressive resume.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
              {/* Video Demo Container */}
              <div className="relative aspect-video w-full lg:col-span-2">
                <div className="absolute inset-0 -right-4 -bottom-4 border-2 border-blue-500/30 rounded-lg transform rotate-1"></div>
                <div className="relative bg-gray-900 rounded-lg overflow-hidden border border-gray-800 shadow-2xl h-full flex items-center justify-center">
                  {/* Primary video (MP4) with YouTube fallback */}
                  <div
                    style={{
                      position: 'relative',
                      boxSizing: 'content-box',
                      maxHeight: '80vh',
                      width: '100%',
                      aspectRatio: 1.7261987491313413,
                      padding: '40px 0 40px 0',
                    }}
                  >
                    <iframe
                      src="https://app.supademo.com/embed/cma2cr2bm2b3n13m0rswcnuw2?embed_v=2"
                      loading="lazy"
                      title="Resumate Demo"
                      allow="clipboard-write"
                      frameBorder="0"
                      allowFullScreen
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                      }}
                    ></iframe>
                  </div>
                </div>
              </div>

              {/* Demo Features */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center">
                    <Target className="h-5 w-5 text-blue-500 mr-2" />
                    ATS Optimization
                  </h3>
                  <p className="text-gray-400">
                    Our resume builder automatically formats your content to
                    pass through applicant tracking systems and impress hiring
                    managers.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center">
                    <Edit className="h-5 w-5 text-green-500 mr-2" />
                    AI Content Generation
                  </h3>
                  <p className="text-gray-400">
                    Let our AI analyze your experience and automatically
                    generate powerful bullet points that highlight your
                    achievements.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center">
                    <Settings className="h-5 w-5 text-purple-500 mr-2" />
                    Real-time Feedback
                  </h3>
                  <p className="text-gray-400">
                    Get instant analysis of your resume&apos;s strengths and
                    weaknesses, with specific suggestions for improvement.
                  </p>
                </div>

                <div className="pt-4">
                  <Link href="/auth/login">
                    <Button className="bg-white text-black hover:bg-gray-200">
                      Try It Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section - Kept but updated */}
        <section id="pricing" className="py-20 border-b border-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4 text-center">
              Choose Your Plan
            </h2>
            <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
              Satisfaction promised with a 100% money back guarantee
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Free Tier */}
              <div className="bg-white text-black p-8 rounded-lg flex flex-col h-full">
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold mb-4">
                    No card required
                  </h3>
                  <p className="text-gray-600 mb-8">
                    Get a feel for how it works. Experience the power of
                    AI-driven resume building.
                  </p>
                </div>

                <div className="mt-auto mb-8">
                  <h3 className="text-6xl font-bold mb-8">Free</h3>
                </div>

                {user ? (
                  <Link href="/resumes">
                    <Button className="w-full bg-gray-200 text-black hover:bg-gray-300 font-semibold">
                      Get started
                    </Button>
                  </Link>
                ) : (
                  <Link href="/auth/login">
                    <Button className="w-full bg-gray-200 text-black hover:bg-gray-300 font-semibold">
                      Get started
                    </Button>
                  </Link>
                )}
              </div>

              {/* Pro Tier */}
              <div className="bg-gradient-to-b from-blue-900 to-indigo-900 text-white p-8 rounded-lg flex flex-col h-full">
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold mb-4">
                    ${MONTHLY_PRICE} Monthly
                  </h3>
                  <p className="text-gray-200 mb-8">
                    Access to basic features plus cover letter builder with
                    unlimited AI credits.
                  </p>
                </div>

                <div className="mt-auto mb-8">
                  <h3 className="text-6xl font-bold mb-8">Pro</h3>
                </div>

                <Button
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold mb-4"
                  onClick={() => initiatePayment(PlanType.MONTHLY)}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Get started'}
                </Button>
              </div>

              {/* Lifetime Tier */}
              <div className="relative bg-gradient-to-b from-blue-500 to-purple-600 text-white p-8 rounded-lg flex flex-col h-full transform hover:scale-105 transition-all duration-300 shadow-xl border-2 border-blue-400">
                <div className="absolute -top-4 right-0 left-0 mx-auto w-fit px-4 py-1 bg-yellow-400 text-black font-bold rounded-full text-sm">
                  BEST VALUE • Save {SAVINGS_PERCENTAGE}%
                </div>
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold mb-4">
                    ${LIFETIME_PRICE} One-Time
                  </h3>
                  <p className="text-gray-100 mb-8">
                    Access to all Resuamate features{' '}
                    <span className="font-bold">forever</span> with a one-time
                    payment. No recurring charges.
                  </p>
                </div>

                <div className="mt-auto mb-8">
                  <h3 className="text-6xl font-bold mb-8">Lifetime</h3>
                </div>

                <Button
                  className="w-full bg-white text-black hover:bg-gray-100 font-semibold mb-4 text-lg"
                  onClick={() => initiatePayment(PlanType.LIFETIME)}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Get Lifetime Access'}
                </Button>
              </div>
            </div>

            <div className="mt-8 text-center text-gray-400 max-w-2xl mx-auto">
              <p>
                Want to self-host? Use your own API keys and run Resumate for
                free on your own infrastructure.
                <a href="#" className="text-blue-500 hover:text-blue-400 ml-1">
                  Learn more about self-hosting
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section - Rezi Style */}
        <section className="py-20 border-b border-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Frequently Asked Questions
            </h2>

            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">
                  Why would I use an AI resume maker?
                </h3>
                <p className="text-gray-400">
                  An AI resume maker helps you build a resume perfectly fit for
                  the job you want. Our AI is designed to speak the language
                  hiring managers are looking for, increasing your chances of
                  standing out in the crowd.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">
                  Will employers know I used AI to write a resume?
                </h3>
                <p className="text-gray-400">
                  Employers might think you used AI, but that&apos;s rarely an
                  issue. What they really care about is getting a well-written
                  resume that showcases your skills and experiences accurately.
                  A top-notch resume tailored to their needs will speak volumes.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">
                  How does Resumate tailor my resume to specific job
                  descriptions?
                </h3>
                <p className="text-gray-400">
                  Resumate uses AI Keyword Targeting that scans the job
                  description to identify crucial keywords and naturally
                  incorporates them into your resume, giving it the right focus
                  without keyword stuffing.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">
                  Can I use AI to optimize an existing resume?
                </h3>
                <p className="text-gray-400">
                  Yes, you can upload your current resume, share details about
                  your career goals and the job you want, and let our AI refine
                  everything to elevate your resume&apos;s impact and ATS
                  compatibility.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of job seekers who have already created
              professional resumes with Resumate.
            </p>
            {user ? (
              <Link href="/resumes">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-200"
                >
                  Create Your Resume Now
                </Button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-200"
                >
                  Create Your Resume Now
                </Button>
              </Link>
            )}
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col items-start">
              <div className="flex items-center mb-4">
                <Logo />
                <span className="font-bold text-xl">Resumate</span>
              </div>
              <p className="text-gray-400 text-sm">
                An open-source AI-powered resume builder that puts you in
                control of your career story.
              </p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <Github className="h-5 w-5" />
                </a>
                {/* Add other social icons as needed */}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase mb-4">
                AI Tools
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Resume Builder
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Resume Editor
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Cover Letter Writer
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Keyword Scanner
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white uppercase mb-4">
                Company
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Resumate. All rights reserved.</p>
            <p className="mt-2">
              Made with 💙 by{' '}
              <Link
                href="https://www.linkedin.com/in/durgesh-chandrakar-586a34267/"
                className="text-blue-500 hover:text-blue-400"
              >
                Durgesh
              </Link>
              .
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage

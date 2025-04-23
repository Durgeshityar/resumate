import React from 'react'
import { Button } from '@/components/ui/button' // Assuming you have a Button component setup with Shadcn/ui or similar
import {
  Github,
  Check,
  Code,
  Shield,
  Users,
  ChevronRight,
  Server,
  Globe,
  Star,
  GitFork,
} from 'lucide-react' // Example icons

import { Doto } from 'next/font/google'

const doto = Doto({
  weight: '800',
  subsets: ['latin'],
})

export const Logo = () => {
  return (
    <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center mr-2">
      <span className={`text-black font-bold ${doto.className}`}>R</span>
    </div>
  )
}

const HomePage = () => {
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
            <a href="#demo" className="text-gray-300 hover:text-white">
              Demo
            </a>
            <a
              href="https://github.com/your-repo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white flex items-center"
            >
              <Github className="h-4 w-4 mr-1" />
              GitHub
            </a>
          </nav>
          <div>
            <Button
              variant="outline"
              className="border-gray-700 text-black hover:text-white hover:bg-gray-800"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section - Vercel Style */}
        <section className="py-20 md:py-32 border-b border-gray-800">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center bg-gray-800 rounded-full px-3 py-1 text-xs text-gray-300 mb-6">
              <span className="bg-green-500 h-2 w-2 rounded-full mr-2"></span>
              Open-Source | Self-hostable | Privacy-Focused
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              AI-Powered Resumes <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500">
                That Get You Hired
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
              Community-driven resume builder with AI-powered optimization. Own
              your data, customize every template, and land your dream job.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-200 transition-all"
              >
                Create Your Resume
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-700 text-black hover:text-white hover:bg-gray-800"
                asChild
              >
                <a
                  href="https://github.com/your-repo"
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

        {/* Features Grid */}
        <section id="features" className="py-20 border-b border-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Built for developers and job seekers alike
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-900 p-6 rounded-lg">
                <div className="h-10 w-10 bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Code className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Fully Customizable
                </h3>
                <p className="text-gray-400">
                  Customize every line of code, every template, and every aspect
                  of your resume.
                </p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg">
                <div className="h-10 w-10 bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Privacy-First</h3>
                <p className="text-gray-400">
                  Your data stays with you. No hidden tracking, no data selling,
                  complete transparency.
                </p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg">
                <div className="h-10 w-10 bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-5 w-5 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community-Driven</h3>
                <p className="text-gray-400">
                  Join a global community of developers building the future of
                  job applications.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* GitHub Stats Section */}
        <section className="py-16 border-b border-gray-800">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center space-x-8 flex-wrap">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="text-2xl font-bold">2.5k</span>
                <span className="text-gray-400 ml-2">Stars</span>
              </div>
              <div className="flex items-center">
                <GitFork className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-2xl font-bold">450+</span>
                <span className="text-gray-400 ml-2">Forks</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-2xl font-bold">120+</span>
                <span className="text-gray-400 ml-2">Contributors</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 border-b border-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4 text-center">
              Choose Your Plan
            </h2>
            <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
              Whether you&apos;re a job seeker on a budget or need advanced
              features, we have options for you. Always open-source, always
              yours.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Tier */}
              <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 flex flex-col h-full">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Community</h3>
                  <div className="flex items-end mb-4">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-gray-400 ml-2">/ forever</span>
                  </div>
                  <p className="text-gray-400">
                    Perfect for job seekers and open-source contributors.
                  </p>
                </div>

                <ul className="mb-8 flex-grow">
                  <li className="flex items-start mb-4">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">
                      Up to 3 resume templates
                    </span>
                  </li>
                  <li className="flex items-start mb-4">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Basic AI suggestions</span>
                  </li>
                  <li className="flex items-start mb-4">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Export to PDF</span>
                  </li>
                  <li className="flex items-start mb-4">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">GitHub integration</span>
                  </li>
                  <li className="flex items-start mb-4">
                    <Server className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">
                      Self-host option available
                    </span>
                  </li>
                </ul>

                <Button className="w-full bg-white text-black hover:bg-gray-200">
                  Get Started Free
                </Button>
              </div>

              {/* Pro Tier */}
              <div className="bg-gradient-to-b from-gray-900 to-black p-8 rounded-lg border border-blue-500/50 flex flex-col h-full relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-xs font-bold px-3 py-1 rounded-full">
                  RECOMMENDED
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Pro</h3>
                  <div className="flex items-end mb-4">
                    <span className="text-4xl font-bold">$9</span>
                    <span className="text-gray-400 ml-2">/ month</span>
                  </div>
                  <p className="text-gray-400">
                    For serious job seekers and professionals.
                  </p>
                </div>

                <ul className="mb-8 flex-grow">
                  <li className="flex items-start mb-4">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">
                      All Community features
                    </span>
                  </li>
                  <li className="flex items-start mb-4">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">
                      Unlimited resume templates
                    </span>
                  </li>
                  <li className="flex items-start mb-4">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">
                      Advanced AI optimization
                    </span>
                  </li>
                  <li className="flex items-start mb-4">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">
                      ATS optimization analysis
                    </span>
                  </li>
                  <li className="flex items-start mb-4">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">
                      Cover letter generator
                    </span>
                  </li>
                  <li className="flex items-start mb-4">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">
                      Job application tracker
                    </span>
                  </li>
                  <li className="flex items-start mb-4">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Priority support</span>
                  </li>
                  <li className="flex items-start mb-4">
                    <Server className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">
                      Self-host option available
                    </span>
                  </li>
                </ul>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Upgrade to Pro
                </Button>
              </div>
            </div>

            <div className="mt-12 text-center">
              <div className="inline-flex items-center px-4 py-2 bg-gray-800 rounded-full">
                <Globe className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-sm">
                  <span className="font-bold">Open-Source Freedom:</span>
                  <span className="text-gray-400">
                    {' '}
                    Self-host with all Pro features for your personal use
                  </span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section id="demo" className="py-20 border-b border-gray-800">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">See It In Action</h2>
            <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
              Our AI-powered resume builder helps you craft professional,
              ATS-friendly resumes in minutes.
            </p>
            {/* Placeholder for demo/screenshot */}
            <div className="bg-gray-800 rounded-lg p-4 h-96 max-w-4xl mx-auto flex items-center justify-center">
              <p className="text-gray-400">
                Interactive resume builder demo goes here
              </p>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">
              Built With Trust In Mind
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-gray-900 p-6 rounded-lg">
                <div className="h-12 w-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">GDPR Compliant</h3>
                <p className="text-gray-400">
                  All user data handling follows strict GDPR guidelines.
                </p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg">
                <div className="h-12 w-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Open Source</h3>
                <p className="text-gray-400">
                  100% transparent codebase. Audit, modify, and contribute.
                </p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg">
                <div className="h-12 w-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Server className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Self-Hostable</h3>
                <p className="text-gray-400">
                  Run on your own infrastructure for complete data sovereignty.
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
              professional resumes with ResumeAI.
            </p>
            <Button size="lg" className="bg-white text-black hover:bg-gray-200">
              Create Your Resume Now
            </Button>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
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
                Product
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Features
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
                    Templates
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Self-Hosting
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase mb-4">
                Resources
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    API
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Resume Tips
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Blog
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
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Careers
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
            <p>© {new Date().getFullYear()} ResumeAI. All rights reserved.</p>
            <p className="mt-2">Made with 💙 by the open source community.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage

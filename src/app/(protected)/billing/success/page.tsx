import { fetchSubscriptionDetails } from '@/actions/user/subscription-actions'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const { user } = await fetchSubscriptionDetails()
  if (!user) {
    return redirect('/auth/login')
  }
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#fafafa] px-3 py-6">
      <Card className="mx-auto max-w-md border-none bg-white shadow-sm">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="flex justify-center">
            <div className="bg-black/5 p-3 rounded-full">
              <CheckCircle className="h-10 w-10 text-black" strokeWidth={1.5} />
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <CardTitle className="text-2xl font-normal text-black">
              Payment Successful
            </CardTitle>
            <CardDescription className="text-gray-500 text-base">
              Your Pro subscription is now active
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="text-center text-sm text-gray-500 px-8">
          <div className="bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 rounded-md p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium text-gray-500 uppercase">
                Plan
              </div>
              <div className="text-sm font-medium">Pro Subscription</div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium text-gray-500 uppercase">
                Status
              </div>
              <div className="inline-flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                <span className="text-sm font-medium">Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-gray-500 uppercase">
                Billing
              </div>
              <div className="text-sm font-medium">
                {user?.Subscription?.plan}
              </div>
            </div>
          </div>
          <p>
            Thank you for your purchase. Your receipt has been emailed to you.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center pb-8 pt-2">
          <Button
            asChild
            className="bg-black hover:bg-black/90 px-6 rounded-md h-10 transition-all duration-200"
          >
            <Link href="/resumes" className="flex items-center gap-2">
              Continue to Dashboard
              <ArrowRight size={14} />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

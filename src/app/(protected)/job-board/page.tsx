import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { AlertCircle, Clock, MailIcon } from 'lucide-react'

export default function JobBoardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-6 bg-gradient-to-b from-gray-50 to-white">
      <Card className="w-full max-w-3xl border shadow-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            Job Board Coming Soon
          </CardTitle>
          <CardDescription className="text-zinc-500">
            We're working hard to bring you a comprehensive job board
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="py-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col items-center p-4 text-center bg-gray-50 rounded-lg">
              <AlertCircle className="h-8 w-8 text-yellow-500 mb-2" />
              <h3 className="font-medium">In Active Development</h3>
              <p className="text-sm text-zinc-500 mt-1">
                I&apos;m building this feature right now
              </p>
            </div>
            <div className="flex flex-col items-center p-4 text-center bg-gray-50 rounded-lg">
              <Clock className="h-8 w-8 text-blue-500 mb-2" />
              <h3 className="font-medium">Launching Soon</h3>
              <p className="text-sm text-zinc-500 mt-1">
                Expected release in the coming weeks
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <h3 className="font-medium mb-2">What to expect:</h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li className="flex items-start gap-2">
                <span className="rounded-full bg-green-500 p-1 h-2 w-2 mt-1.5"></span>
                <span>Job listings from top companies in your field</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="rounded-full bg-green-500 p-1 h-2 w-2 mt-1.5"></span>
                <span>
                  Personalized job recommendations based on your resume
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="rounded-full bg-green-500 p-1 h-2 w-2 mt-1.5"></span>
                <span>Application tracking and management tools</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="rounded-full bg-green-500 p-1 h-2 w-2 mt-1.5"></span>
                <span>Integration with your existing resume profiles</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full">
            <MailIcon className="mr-2 h-4 w-4" />
            Get notified when it's ready
          </Button>
          <p className="text-xs text-center text-zinc-500">
            We'll notify you as soon as the job board is available for use
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

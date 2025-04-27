'use client'

import { useState } from 'react'
import { DocumentEditorFormProps } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles,
  CheckCircle,
  XCircle,
  Copy,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  Wand2,
  FileWarning,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  analyzeResume,
  AtsAnalysisResult,
  optimizeResume,
} from '@/actions/ai/resume-analysis'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Progress } from '@/components/ui/progress'
import { useSubscription } from '@/hooks/use-subscription'

export default function AtsScore({
  resumeData,
  setResumeData,
}: DocumentEditorFormProps) {
  const [jobDescription, setJobDescription] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [atsResult, setAtsResult] = useState<AtsAnalysisResult | null>(null)
  const [optimized, setOptimized] = useState(false)
  const { isSubscribed, credits, isFeatureAvailable, subscriptionActions } =
    useSubscription()

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return

    // Check if user can use this premium feature
    const canProceed = await subscriptionActions.useFeature()
    if (!canProceed) return

    setIsAnalyzing(true)
    try {
      const result = await analyzeResume(resumeData, jobDescription)
      setAtsResult(result)
      setOptimized(false)

      // Check for missing essential sections and warn the user
      const hasMissingEssentials =
        result.content_issues?.missing_sections &&
        result.content_issues.missing_sections.length > 0

      if (hasMissingEssentials) {
        toast.warning(
          'Essential sections are missing from your resume. ATS systems require complete information.',
          {
            duration: 5000,
          }
        )
      }
    } catch (error) {
      console.error('Error analyzing resume:', error)
      toast.error('Error analyzing resume. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleOptimize = async () => {
    if (!jobDescription.trim() || !atsResult) return

    // Check if user can use this premium feature
    const canProceed = await subscriptionActions.useFeature()
    if (!canProceed) return

    setIsOptimizing(true)
    try {
      const optimizedResume = await optimizeResume(resumeData, jobDescription)

      // Update the resume data with the optimized version
      setResumeData(optimizedResume)

      // Re-analyze to see the improved score
      const newResult = await analyzeResume(optimizedResume, jobDescription)
      setAtsResult(newResult)
      setOptimized(true)
      toast.success('Resume optimized successfully!')
    } catch (error) {
      console.error('Error optimizing resume:', error)
      toast.error('Error optimizing resume. Please try again.')
    } finally {
      setIsOptimizing(false)
    }
  }

  // Calculate score color and message based on score value
  const getScoreDetails = (score: number) => {
    if (score >= 80) {
      return {
        color: 'text-green-500',
        circleColor: 'text-green-500',
        message: 'Great! Your resume is highly ATS compatible.',
      }
    } else if (score >= 60) {
      return {
        color: 'text-yellow-500',
        circleColor: 'text-yellow-500',
        message:
          'Good, but your resume needs some improvements for better ATS compatibility.',
      }
    } else {
      return {
        color: 'text-red-500',
        circleColor: 'text-red-500',
        message:
          'Your resume needs significant improvements for ATS compatibility.',
      }
    }
  }

  const getCreditsLabel = () => {
    if (isSubscribed) return null

    return (
      <div className="text-xs text-muted-foreground">
        This will use 1 credit from your account. You have {credits} credit
        {credits !== 1 ? 's' : ''} remaining.
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">ATS Compatibility Score</h2>
        <p className="text-sm text-muted-foreground">
          Analyze your resume against a job description to see how it performs
          with ATS systems
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
          <CardDescription>
            Paste the job description you&apos;re applying for to analyze your
            resume&apos;s compatibility
            {!isSubscribed && (
              <p className="mt-1 text-xs opacity-80">
                Using ATS analysis requires credits
              </p>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[150px]"
          />
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button
            onClick={handleAnalyze}
            disabled={
              isAnalyzing || !jobDescription.trim() || !isFeatureAvailable
            }
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Analyze Resume
                {!isSubscribed && credits >= 0 && (
                  <div className="ml-2 text-xs bg-primary/20 px-1.5 py-0.5 rounded-md">
                    {credits} credit{credits !== 1 ? 's' : ''}
                  </div>
                )}
              </>
            )}
          </Button>
          {getCreditsLabel()}
        </CardFooter>
      </Card>

      {atsResult && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center flex-wrap gap-4">
                <CardTitle>ATS Compatibility Score</CardTitle>
                {optimized && (
                  <Badge className="ml-2" variant="success">
                    Optimized
                  </Badge>
                )}
                {!optimized && (
                  <Button
                    onClick={handleOptimize}
                    disabled={isOptimizing || !isFeatureAvailable}
                    size="sm"
                    variant="secondary"
                    className="relative"
                  >
                    {isOptimizing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Auto-Optimize Resume
                        {!isSubscribed && credits >= 0 && (
                          <div className="ml-2 text-xs bg-primary/20 px-1.5 py-0.5 rounded-md">
                            {credits} credit{credits !== 1 ? 's' : ''}
                          </div>
                        )}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      className="text-gray-200 stroke-current"
                      strokeWidth="8"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                    ></circle>
                    <circle
                      className={`${
                        getScoreDetails(atsResult.score).circleColor
                      } stroke-current`}
                      strokeWidth="8"
                      strokeLinecap="round"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      strokeDasharray={`${atsResult.score * 2.51} 251`}
                      strokeDashoffset="0"
                      transform="rotate(-90 50 50)"
                    ></circle>
                  </svg>
                  <span className="absolute text-3xl font-bold">
                    {atsResult.score}
                  </span>
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  {getScoreDetails(atsResult.score).message}
                </p>
              </div>

              {/* Section Scores */}
              {atsResult.section_scores && (
                <div className="mt-6 border-t pt-4">
                  <h4 className="font-medium mb-3 text-center">
                    Section Scores
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(atsResult.section_scores || {}).map(
                      ([section, score]) =>
                        score !== undefined && (
                          <div
                            key={section}
                            className="flex justify-between items-center"
                          >
                            <div className="capitalize text-sm">
                              {section.replace(/_/g, ' ')}
                              {score < 50 && (
                                <FileWarning className="inline-block ml-1 h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress value={score} className="w-24 h-2" />
                              <span
                                className={`text-xs font-medium ${
                                  score < 60
                                    ? 'text-red-500'
                                    : score < 80
                                    ? 'text-yellow-500'
                                    : 'text-green-500'
                                }`}
                              >
                                {score}
                              </span>
                            </div>
                          </div>
                        )
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="keywords">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
              <TabsTrigger value="issues">Content Issues</TabsTrigger>
              <TabsTrigger value="improvements">Improvements</TabsTrigger>
            </TabsList>

            <TabsContent value="keywords" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      Matched Keywords
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {atsResult.matched_keywords &&
                      atsResult.matched_keywords.length > 0 ? (
                        atsResult.matched_keywords.map(
                          (keyword: string, i: number) => (
                            <Badge key={i} variant="success">
                              {keyword}
                            </Badge>
                          )
                        )
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No matched keywords found. This suggests your resume
                          isn&apos;t aligned with the job description.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <XCircle className="h-5 w-5 mr-2 text-red-500" />
                      Missing Keywords
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {atsResult.missing_keywords &&
                      atsResult.missing_keywords.length > 0 ? (
                        atsResult.missing_keywords.map(
                          (keyword: string, i: number) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="border-red-500 text-red-500"
                            >
                              {keyword}
                            </Badge>
                          )
                        )
                      ) : (
                        <p className="text-sm text-green-500">
                          Great! Your resume contains all important keywords
                          from the job description.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="issues" className="space-y-4 mt-4">
              {atsResult.content_issues && (
                <>
                  {atsResult.content_issues.missing_sections &&
                    atsResult.content_issues.missing_sections.length > 0 && (
                      <Alert variant="destructive">
                        <FileWarning className="h-4 w-4" />
                        <AlertTitle>Missing Essential Sections</AlertTitle>
                        <AlertDescription>
                          <p className="mb-2 font-medium">
                            ATS systems may automatically reject resumes with
                            missing essential sections.
                          </p>
                          <ul className="list-disc pl-5 space-y-1 mt-2">
                            {atsResult.content_issues.missing_sections.map(
                              (issue, i) => (
                                <li key={i} className="text-sm">
                                  {issue}
                                </li>
                              )
                            )}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}

                  {atsResult.content_issues.duplicates &&
                    atsResult.content_issues.duplicates.length > 0 && (
                      <Alert variant="destructive">
                        <Copy className="h-4 w-4" />
                        <AlertTitle>Duplicate Content</AlertTitle>
                        <AlertDescription>
                          <ul className="list-disc pl-5 space-y-1 mt-2">
                            {atsResult.content_issues.duplicates.map(
                              (issue, i) => (
                                <li key={i} className="text-sm">
                                  {issue}
                                </li>
                              )
                            )}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}

                  {atsResult.content_issues.missing_info &&
                    atsResult.content_issues.missing_info.length > 0 && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Missing Information</AlertTitle>
                        <AlertDescription>
                          <ul className="list-disc pl-5 space-y-1 mt-2">
                            {atsResult.content_issues.missing_info.map(
                              (issue, i) => (
                                <li key={i} className="text-sm">
                                  {issue}
                                </li>
                              )
                            )}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}

                  {atsResult.content_issues.weak_content &&
                    atsResult.content_issues.weak_content.length > 0 && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Weak Content</AlertTitle>
                        <AlertDescription>
                          <ul className="list-disc pl-5 space-y-1 mt-2">
                            {atsResult.content_issues.weak_content.map(
                              (issue, i) => (
                                <li key={i} className="text-sm">
                                  {issue}
                                </li>
                              )
                            )}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                </>
              )}
            </TabsContent>

            <TabsContent value="improvements" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sections to Improve</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {Object.entries(atsResult.sections_to_improve || {}).map(
                      ([section, improvements], i) =>
                        improvements && improvements.length > 0 ? (
                          <AccordionItem key={i} value={section}>
                            <AccordionTrigger className="capitalize">
                              <div className="flex items-center">
                                {section.replace(/_/g, ' ')}
                                {(section === 'personal_info' ||
                                  section === 'contact_info' ||
                                  section === 'education') && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <FileWarning className="inline-block ml-2 h-4 w-4 text-yellow-500" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        This is an essential section required by
                                        most ATS systems
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <ul className="list-disc pl-5 space-y-1">
                                {improvements.map(
                                  (improvement: string, j: number) => (
                                    <li key={j} className="text-sm">
                                      {improvement}
                                    </li>
                                  )
                                )}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        ) : null
                    )}
                  </Accordion>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>General Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {atsResult.recommendations &&
                      atsResult.recommendations.length > 0 &&
                      atsResult.recommendations.map(
                        (recommendation: string, i: number) => (
                          <li key={i} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>{recommendation}</span>
                          </li>
                        )
                      )}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}

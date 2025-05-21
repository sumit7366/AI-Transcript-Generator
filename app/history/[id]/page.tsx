// app/history/[id]/page.tsx
import { AVAILABLE_LANGUAGES } from '@/lib/youtube'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Youtube, Clock, Globe, Download } from 'lucide-react'
import React from 'react'
import Link from 'next/link'

interface Summary {
  id: string
  videoId: string
  title: string
  content: string
  language: string
  createdAt: string
}

interface PageProps {
  params: { id: string }
}

async function getSummary(id: string): Promise<Summary | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/history/${id}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.summary
  } catch {
    return null
  }
}

export default async function HistoryDetailPage({ params }: PageProps) {
  const summary = await getSummary(params.id)

  if (!summary) {
    return (
      <Card>
        <CardContent>
          <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md">
            Summary not found.
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getLanguageDisplay = (code: string) => {
    const entry = Object.entries(AVAILABLE_LANGUAGES).find(([_, langCode]) => langCode === code)
    return entry ? entry[0] : code
  }

  const formatContent = (content: string) => {
    const sections = content.split(/(<h[1-6].*?<\/h[1-6]>)/)

    return sections.map((section, index) => {
      if (section.startsWith('<h')) {
        return (
          <div key={index} className="mt-6 mb-3 first:mt-0">
            <div dangerouslySetInnerHTML={{ __html: section }} />
          </div>
        )
      } else {
        const paragraphs = section.split('\n').filter((p) => p.trim() !== '')
        return (
          <div key={index} className="space-y-4">
            {paragraphs.map((paragraph, pIndex) => (
              <p key={pIndex} className="text-gray-700 dark:text-gray-300">
                {paragraph}
              </p>
            ))}
          </div>
        )
      }
    })
  }

  const videoUrl = `https://www.youtube.com/watch?v=${summary.videoId}`

  return (
    <Card>
      <CardHeader>
        <Link href="/history" className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to History
        </Link>
        <CardTitle className="text-3xl font-bold">{summary.title}</CardTitle>
        <CardDescription>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant="secondary" className="flex items-center">
              <Globe className="mr-1 h-3 w-3" />
              {getLanguageDisplay(summary.language)}
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <Clock className="mr-1 h-3 w-3" />
              {formatDate(summary.createdAt)}
            </Badge>
            <Button variant="outline" size="sm" asChild>
              <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                <Youtube className="mr-1 h-3 w-3" />
                Watch on YouTube
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const blob = new Blob([summary.content], { type: 'text/plain' })
                const url = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = `${summary.title}.txt`
                link.click()
                URL.revokeObjectURL(url)
              }}
              className="flex items-center"
            >
              <Download className="mr-1 h-3 w-3" />
              Download Summary
            </Button>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-6">{formatContent(summary.content)}</CardContent>
    </Card>
  )
}

import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import { AVAILABLE_LANGUAGES } from "@/lib/youtube"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Youtube, Clock, Globe, Download } from "lucide-react"

interface Summary {
  id: string
  videoId: string
  title: string
  content: string
  language: string
  createdAt: string
}

interface PageProps {
  params: {
    id: string;
  };
}

async function fetchSummary(id: string): Promise<Summary | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/history/${id}`, {
    cache: "no-store",
  })

  if (!res.ok) return null

  const data = await res.json()
  return data.summary ?? null
}

export default async function HistoryDetailPage({ params }: PageProps) {
  const { id } = params
  const summary = await fetchSummary(id)

  if (!summary) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getLanguageDisplay = (code: string) => {
    const entry = Object.entries(AVAILABLE_LANGUAGES).find(([_, langCode]) => langCode === code)
    return entry ? entry[0] : code
  }

  const videoUrl = `https://www.youtube.com/watch?v=${summary.videoId}`

  return (
    <Card>
      <CardHeader>
        <Button variant="ghost" onClick={() => window.history.back()} className="mb-4 p-0 h-auto font-normal">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to History
        </Button>
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
                const blob = new Blob([summary.content], { type: "text/plain" })
                const url = URL.createObjectURL(blob)
                const link = document.createElement("a")
                link.href = url
                link.download = `${summary.title}.txt`
                link.click()
                URL.revokeObjectURL(url)
              }}
              className="flex items-center mt-2"
            >
              <Download className="mr-1 h-3 w-3" />
              Download Summary
            </Button>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm sm:prose lg:prose-lg max-w-none dark:prose-invert">
          <ReactMarkdown>{summary.content}</ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  )
}

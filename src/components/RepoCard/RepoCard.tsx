import type { GitHubRepo } from '../../types'
import { Card, CardContent } from '@/components/ui/card'

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Vue: '#41b883',
  Scss: '#c6538c',
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  const intervals: [number, string][] = [
    [31536000, 'year'],
    [2592000, 'month'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
  ]
  for (const [secs, label] of intervals) {
    const count = Math.floor(seconds / secs)
    if (count >= 1) {
      return `${count} ${label}${count !== 1 ? 's' : ''} ago`
    }
  }
  return 'just now'
}

interface Props {
  repo: GitHubRepo
}

export default function RepoCard({ repo }: Props) {
  const langColor = repo.language ? LANGUAGE_COLORS[repo.language] ?? '#888' : null

  return (
    <Card className="py-3 hover:border-primary/50 transition-colors">
      <CardContent className="flex items-center gap-3 py-0">
        {repo.language && (
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: langColor! }}
          />
        )}
        <div className="flex flex-col min-w-0 flex-1">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary font-semibold hover:underline truncate"
          >
            {repo.name}
          </a>
          {repo.description && (
            <p className="text-xs text-muted-foreground truncate">
              {repo.description}
            </p>
          )}
        </div>
        <span className="text-xs text-muted-foreground shrink-0">
          {timeAgo(repo.updated_at)}
        </span>
      </CardContent>
    </Card>
  )
}

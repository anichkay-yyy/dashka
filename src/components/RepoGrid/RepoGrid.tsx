import { useEffect, useState } from 'react'
import type { GitHubRepo } from '../../types'
import RepoCard from '../RepoCard/RepoCard'

const API_URL = 'https://api.github.com/users/anichkay-yyy/repos?per_page=100&sort=updated'

export default function RepoGrid() {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`GitHub API: ${res.status}`)
        return res.json()
      })
      .then((data: GitHubRepo[]) => setRepos(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-muted-foreground text-center py-8">Loading repositories...</p>
  }

  if (error) {
    return <p className="text-destructive text-center py-8">Error: {error}</p>
  }

  return (
    <div className="w-full h-full overflow-hidden">
      <div
        className="grid gap-3 w-full h-full"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gridAutoRows: '58px',
        }}
      >
        {repos.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    </div>
  )
}

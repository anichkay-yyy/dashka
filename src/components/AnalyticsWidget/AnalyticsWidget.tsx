import type { AnalyticsWidgetConfig } from '../../types'

const BASE_URL_KEY = 'dashka-analytics-base-url'
const DEFAULT_BASE_URL = 'https://analytics.anichkay.dev'

export function getAnalyticsBaseUrl(): string {
  return localStorage.getItem(BASE_URL_KEY) || DEFAULT_BASE_URL
}

export function setAnalyticsBaseUrl(url: string) {
  localStorage.setItem(BASE_URL_KEY, url)
}

function buildWidgetUrl(config: AnalyticsWidgetConfig): string {
  const base = getAnalyticsBaseUrl().replace(/\/$/, '')
  if (config.type === 'docs') {
    return `${base}/widget/docs`
  }
  return `${base}/widget/${config.type}?siteId=${encodeURIComponent(config.siteId)}`
}

export default function AnalyticsWidget({ config }: { config: AnalyticsWidgetConfig }) {
  return (
    <iframe
      src={buildWidgetUrl(config)}
      className="w-full h-full border-none rounded-b-2xl"
      style={{ minHeight: '120px', background: '#0d1117' }}
      title={config.title}
    />
  )
}

export interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
}

export type AnalyticsWidgetType = 'stats' | 'chart' | 'pages' | 'realtime' | 'docs';

export interface AnalyticsWidgetConfig {
  id: string;
  type: AnalyticsWidgetType;
  siteId: string;
  title: string;
  widgetType: 'analytics';
}

export interface BacklogWidgetConfig {
  id: string;
  title: string;
  widgetType: 'backlog';
}

export type WidgetConfig = AnalyticsWidgetConfig | BacklogWidgetConfig;

export const ANALYTICS_WIDGET_TYPES: { value: AnalyticsWidgetType; label: string; description: string; needsSiteId: boolean }[] = [
  { value: 'stats', label: 'Stats', description: 'Просмотры, сессии, посетители', needsSiteId: true },
  { value: 'chart', label: 'Chart', description: 'График просмотров', needsSiteId: true },
  { value: 'pages', label: 'Pages', description: 'Топ страниц', needsSiteId: true },
  { value: 'realtime', label: 'Realtime', description: 'Live-статистика', needsSiteId: true },
  { value: 'docs', label: 'Docs', description: 'Документация', needsSiteId: false },
];

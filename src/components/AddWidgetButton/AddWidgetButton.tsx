import { useState } from 'react'
import { Plus, X, Settings2 } from 'lucide-react'
import { ANALYTICS_WIDGET_TYPES, type WidgetConfig, type AnalyticsWidgetType } from '../../types'
import { getAnalyticsBaseUrl, setAnalyticsBaseUrl } from '../AnalyticsWidget/AnalyticsWidget'

interface Props {
  onAdd: (widget: WidgetConfig) => void
}

type WidgetCategory = 'analytics' | 'backlog'

export default function AddWidgetButton({ onAdd }: Props) {
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState<WidgetCategory>('backlog')
  const [type, setType] = useState<AnalyticsWidgetType>('stats')
  const [siteId, setSiteId] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [baseUrl, setBaseUrl] = useState(getAnalyticsBaseUrl)

  const selected = ANALYTICS_WIDGET_TYPES.find((t) => t.value === type)!

  const handleAdd = () => {
    if (category === 'backlog') {
      const id = `backlog-${Date.now()}`
      onAdd({
        id,
        title: 'Бэклог',
        widgetType: 'backlog',
      })
      setOpen(false)
    } else {
      const id = `analytics-${Date.now()}`
      const title = selected.needsSiteId
        ? `${selected.label} — ${siteId}`
        : selected.label
      onAdd({
        id,
        type,
        siteId: selected.needsSiteId ? siteId : '',
        title,
        widgetType: 'analytics',
      })
      setSiteId('')
      setOpen(false)
    }
  }

  const handleSaveUrl = () => {
    setAnalyticsBaseUrl(baseUrl)
    setShowSettings(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:brightness-125 transition-all cursor-pointer"
      >
        <Plus size={28} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold">Добавить виджет</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-1.5 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
                  title="Настройки URL"
                >
                  <Settings2 size={18} className="text-muted-foreground" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
                >
                  <X size={18} className="text-muted-foreground" />
                </button>
              </div>
            </div>

            {showSettings && (
              <div className="mb-5 p-4 bg-secondary rounded-xl">
                <label className="block text-xs text-muted-foreground uppercase tracking-wide mb-2">
                  Base URL аналитики
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                  />
                  <button
                    onClick={handleSaveUrl}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:brightness-125 transition-all cursor-pointer"
                  >
                    OK
                  </button>
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-xs text-muted-foreground uppercase tracking-wide mb-2">
                Категория
              </label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={() => setCategory('backlog')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    category === 'backlog'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/40'
                  }`}
                >
                  <div className="text-sm font-medium">Бэклог</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Список задач</div>
                </button>
                <button
                  onClick={() => setCategory('analytics')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    category === 'analytics'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/40'
                  }`}
                >
                  <div className="text-sm font-medium">Аналитика</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Статистика сайтов</div>
                </button>
              </div>
            </div>

            {category === 'analytics' && (
              <div className="mb-4">
                <label className="block text-xs text-muted-foreground uppercase tracking-wide mb-2">
                  Тип виджета
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ANALYTICS_WIDGET_TYPES.map((wt) => (
                    <button
                      key={wt.value}
                      onClick={() => setType(wt.value)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        type === wt.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/40'
                      }`}
                    >
                      <div className="text-sm font-medium">{wt.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{wt.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {category === 'analytics' && selected.needsSiteId && (
              <div className="mb-5">
                <label className="block text-xs text-muted-foreground uppercase tracking-wide mb-2">
                  Site ID
                </label>
                <input
                  type="text"
                  value={siteId}
                  onChange={(e) => setSiteId(e.target.value)}
                  placeholder="Введите Site ID"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            )}

            <button
              onClick={handleAdd}
              disabled={category === 'analytics' && selected.needsSiteId && !siteId.trim()}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:brightness-125 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Добавить
            </button>
          </div>
        </div>
      )}
    </>
  )
}

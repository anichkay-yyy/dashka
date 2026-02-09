import { useState, useEffect } from 'react'
import { Plus, Trash2, Check, Circle } from 'lucide-react'

export interface BacklogItem {
  id: string
  text: string
  completed: boolean
  createdAt: number
  priority: 'low' | 'medium' | 'high'
}

interface BacklogWidgetProps {
  widgetId: string
}

const PRIORITY_COLORS = {
  low: 'text-green-400',
  medium: 'text-yellow-400',
  high: 'text-red-400',
}

const PRIORITY_LABELS = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
}

function getStorageKey(widgetId: string) {
  return `backlog-widget-${widgetId}`
}

function loadBacklogItems(widgetId: string): BacklogItem[] {
  try {
    const raw = localStorage.getItem(getStorageKey(widgetId))
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  return []
}

function saveBacklogItems(widgetId: string, items: BacklogItem[]) {
  localStorage.setItem(getStorageKey(widgetId), JSON.stringify(items))
}

export default function BacklogWidget({ widgetId }: BacklogWidgetProps) {
  const [items, setItems] = useState<BacklogItem[]>(() => loadBacklogItems(widgetId))
  const [newItemText, setNewItemText] = useState('')
  const [newItemPriority, setNewItemPriority] = useState<'low' | 'medium' | 'high'>('medium')

  useEffect(() => {
    saveBacklogItems(widgetId, items)
  }, [items, widgetId])

  const handleAddItem = () => {
    if (!newItemText.trim()) return

    const newItem: BacklogItem = {
      id: `${Date.now()}-${Math.random()}`,
      text: newItemText.trim(),
      completed: false,
      createdAt: Date.now(),
      priority: newItemPriority,
    }

    setItems((prev) => [newItem, ...prev])
    setNewItemText('')
    setNewItemPriority('medium')
  }

  const handleToggleComplete = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )
  }

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAddItem()
    }
  }

  const sortedItems = [...items].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    return b.createdAt - a.createdAt
  })

  const stats = {
    total: items.length,
    completed: items.filter((i) => i.completed).length,
    active: items.filter((i) => !i.completed).length,
  }

  return (
    <div className="h-full flex flex-col bg-card p-4">
      {/* Stats */}
      <div className="flex gap-4 mb-4 text-xs text-muted-foreground">
        <div>
          Всего: <span className="text-foreground font-semibold">{stats.total}</span>
        </div>
        <div>
          Активных: <span className="text-blue-400 font-semibold">{stats.active}</span>
        </div>
        <div>
          Выполнено: <span className="text-green-400 font-semibold">{stats.completed}</span>
        </div>
      </div>

      {/* Add new item */}
      <div className="mb-4 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Новая задача..."
            className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleAddItem}
            disabled={!newItemText.trim()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Добавить задачу"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="flex gap-2">
          {(['low', 'medium', 'high'] as const).map((priority) => (
            <button
              key={priority}
              onClick={() => setNewItemPriority(priority)}
              className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                newItemPriority === priority
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-border hover:border-primary'
              }`}
            >
              {PRIORITY_LABELS[priority]}
            </button>
          ))}
        </div>
      </div>

      {/* Items list */}
      <div className="flex-1 overflow-auto space-y-2">
        {sortedItems.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-8">
            Список задач пуст. Добавьте первую задачу!
          </div>
        ) : (
          sortedItems.map((item) => (
            <div
              key={item.id}
              className={`group flex items-start gap-3 p-3 rounded-lg border transition-all ${
                item.completed
                  ? 'bg-background/50 border-border/50 opacity-60'
                  : 'bg-background border-border hover:border-primary/50'
              }`}
            >
              <button
                onClick={() => handleToggleComplete(item.id)}
                className="mt-0.5 shrink-0 text-muted-foreground hover:text-primary transition-colors"
                title={item.completed ? 'Отметить как незавершенную' : 'Отметить как выполненную'}
              >
                {item.completed ? <Check size={18} className="text-green-400" /> : <Circle size={18} />}
              </button>

              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm break-words ${
                    item.completed
                      ? 'line-through text-muted-foreground'
                      : 'text-foreground'
                  }`}
                >
                  {item.text}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs ${PRIORITY_COLORS[item.priority]}`}>
                    {PRIORITY_LABELS[item.priority]}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleDeleteItem(item.id)}
                className="shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                title="Удалить задачу"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

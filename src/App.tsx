import { useState, useCallback, useRef, useEffect, useSyncExternalStore } from 'react'
import {
  Responsive,
  type Layout,
  type ResponsiveLayouts,
} from 'react-grid-layout'

import RepoGrid from './components/RepoGrid/RepoGrid'
import WireGuardPanel from './components/WireGuardPanel/WireGuardPanel'

const STORAGE_KEY = 'dashka-layouts'

const DEFAULT_LAYOUTS: ResponsiveLayouts = {
  lg: [
    { i: 'repos', x: 0, y: 0, w: 18, h: 6, minW: 8, minH: 2 },
    { i: 'wireguard', x: 18, y: 0, w: 30, h: 12, minW: 14, minH: 6 },
  ],
  md: [
    { i: 'repos', x: 0, y: 0, w: 14, h: 6, minW: 6, minH: 2 },
    { i: 'wireguard', x: 14, y: 0, w: 22, h: 12, minW: 10, minH: 6 },
  ],
  sm: [
    { i: 'repos', x: 0, y: 0, w: 24, h: 5, minW: 6, minH: 3 },
    { i: 'wireguard', x: 0, y: 5, w: 24, h: 10, minW: 8, minH: 4 },
  ],
  xs: [
    { i: 'repos', x: 0, y: 0, w: 12, h: 5, minW: 4, minH: 3 },
    { i: 'wireguard', x: 0, y: 5, w: 12, h: 10, minW: 4, minH: 4 },
  ],
  xxs: [
    { i: 'repos', x: 0, y: 0, w: 6, h: 5, minW: 2, minH: 3 },
    { i: 'wireguard', x: 0, y: 5, w: 6, h: 10, minW: 2, minH: 4 },
  ],
}

function loadLayouts(): ResponsiveLayouts {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return DEFAULT_LAYOUTS
}

function useWindowWidth() {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener('resize', cb)
      return () => window.removeEventListener('resize', cb)
    },
    () => window.innerWidth,
    () => 1920,
  )
}

function Widget({ title, children, noPad = false }: { title: string; children: React.ReactNode; noPad?: boolean }) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col h-full">
      <div className="drag-handle px-5 py-3 border-b border-border shrink-0 cursor-grab active:cursor-grabbing">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide select-none">{title}</h2>
      </div>
      <div className={`flex-1 ${noPad ? '' : 'p-4'} min-h-0 overflow-auto`}>{children}</div>
    </div>
  )
}

export default function App() {
  const windowWidth = useWindowWidth()
  const [layouts, setLayouts] = useState(loadLayouts)
  const layoutsRef = useRef(layouts)

  const onLayoutChange = useCallback((_current: Layout[], allLayouts: ResponsiveLayouts) => {
    layoutsRef.current = allLayouts
    setLayouts(allLayouts)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allLayouts))
  }, [])

  useEffect(() => {
    const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(layoutsRef.current))
    window.addEventListener('beforeunload', save)
    return () => window.removeEventListener('beforeunload', save)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Responsive
        width={windowWidth}
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 48, md: 36, sm: 24, xs: 12, xxs: 6 }}
        rowHeight={60}
        margin={[16, 16]}
        containerPadding={[16, 16]}
        dragConfig={{ enabled: true, handle: '.drag-handle' }}
        resizeConfig={{ enabled: true, handles: ['s', 'e', 'w', 'n', 'se', 'sw', 'ne', 'nw'] }}
        onLayoutChange={onLayoutChange}
      >
        <div key="repos">
          <Widget title="Recent repos">
            <RepoGrid />
          </Widget>
        </div>
        <div key="wireguard">
          <Widget title="WireGuard" noPad>
            <WireGuardPanel />
          </Widget>
        </div>
      </Responsive>
    </div>
  )
}

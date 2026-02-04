import { useEffect, useRef } from 'react'

const DARK_CSS = `
/* ===== body & root ===== */
body, .bg-gray-50 {
  background-color: #0d1117 !important;
  color: #c9d1d9 !important;
}

/* ===== cards / white blocks ===== */
.bg-white {
  background-color: #161b22 !important;
  color: #c9d1d9 !important;
}

/* ===== borders ===== */
.border-gray-100,
.border-gray-200,
.border-gray-300 {
  border-color: #30363d !important;
}

/* ===== text ===== */
.text-gray-900 { color: #f0f6fc !important; }
.text-gray-700 { color: #c9d1d9 !important; }
.text-gray-600 { color: #8b949e !important; }
.text-gray-500 { color: #8b949e !important; }
.text-gray-400 { color: #6e7681 !important; }
.text-gray-300 { color: #484f58 !important; }
.text-gray-200 { color: #30363d !important; }

/* ===== button / icon backgrounds ===== */
.bg-gray-100 {
  background-color: #21262d !important;
  color: #c9d1d9 !important;
}
.bg-gray-200 {
  background-color: #30363d !important;
}

/* ===== hover states ===== */
.hover\\:bg-gray-50:hover {
  background-color: #161b22 !important;
}
.hover\\:bg-gray-300:hover {
  background-color: #484f58 !important;
}

/* ===== inputs ===== */
input[type="text"],
input[type="password"],
input:not([type]) {
  background-color: #0d1117 !important;
  color: #c9d1d9 !important;
  border-color: #30363d !important;
}
input:focus {
  border-color: #58a6ff !important;
}

/* ===== shadows (softer for dark) ===== */
.shadow, .shadow-md, .shadow-lg, .shadow-xl {
  box-shadow: 0 1px 3px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.4) !important;
}
.rounded-lg.shadow-md,
.shadow-md.rounded-lg {
  box-shadow: 0 2px 8px rgba(0,0,0,0.5) !important;
}

/* ===== modal overlay ===== */
.bg-gray-500.opacity-75 {
  background-color: #000 !important;
  opacity: 0.7 !important;
}

/* ===== modal content ===== */
.inline-block.align-bottom.bg-white,
.bg-white.rounded-lg {
  background-color: #161b22 !important;
}
.bg-gray-50[class*="px-4"][class*="py-3"] {
  background-color: #0d1117 !important;
}

/* ===== red accent buttons — keep red-800, fix text ===== */
.bg-red-800 {
  background-color: #991b1b !important;
}
.hover\\:bg-red-800:hover {
  background-color: #991b1b !important;
  color: #fff !important;
}
.hover\\:bg-red-700:hover {
  background-color: #b91c1c !important;
}

/* ===== avatar circles ===== */
.rounded-full.bg-gray-50 {
  background-color: #21262d !important;
}

/* ===== toggle enabled ===== */
.rounded-full.bg-gray-200 {
  background-color: #30363d !important;
}

/* ===== footer text ===== */
p.text-center.text-gray-300 a {
  color: #484f58 !important;
}
p.text-center.text-gray-300 a:hover {
  color: #8b949e !important;
}

/* ===== login form ===== */
form.shadow {
  background-color: #161b22 !important;
}
h1.text-gray-700 {
  color: #c9d1d9 !important;
}

/* ===== scrollbar ===== */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #0d1117; }
::-webkit-scrollbar-thumb { background: #30363d; border-radius: 3px; }

/* ===== QR code modal ===== */
.bg-white.rounded-md.shadow-lg {
  background-color: #161b22 !important;
}
`

export default function WireGuardPanel() {
  const ref = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const iframe = ref.current
    if (!iframe) return

    const inject = () => {
      try {
        const doc = iframe.contentDocument
        if (!doc) return
        if (doc.getElementById('dashka-dark')) return
        const style = doc.createElement('style')
        style.id = 'dashka-dark'
        style.textContent = DARK_CSS
        doc.head.appendChild(style)

        // Isolate the Clients block, hide everything else
        if (!doc.getElementById('dashka-isolate')) {
          const script = doc.createElement('script')
          script.id = 'dashka-isolate'
          script.textContent = `
            (function isolateClients() {
              var card = document.querySelector('.shadow-md.rounded-lg.bg-white.overflow-hidden');
              if (!card) { setTimeout(isolateClients, 100); return; }
              var el = card;
              while (el.parentElement) {
                Array.from(el.parentElement.children).forEach(function(s) {
                  if (s !== el && s.tagName !== 'STYLE' && s.tagName !== 'SCRIPT')
                    s.style.display = 'none';
                });
                el.parentElement.style.padding = '0';
                el.parentElement.style.margin = '0';
                el.parentElement.style.maxWidth = 'none';
                el = el.parentElement;
              }
              document.body.style.padding = '0';
              document.body.style.margin = '0';
            })();
          `
          doc.body.appendChild(script)
        }
      } catch {
        // cross-origin — ignore
      }
    }

    iframe.addEventListener('load', inject)
    return () => iframe.removeEventListener('load', inject)
  }, [])

  return (
    <iframe
      ref={ref}
      src="http://172.23.114.229:51821/"
      className="w-full h-full border-none rounded-b-2xl"
      style={{ minHeight: '400px', background: '#0d1117' }}
      title="WireGuard"
    />
  )
}

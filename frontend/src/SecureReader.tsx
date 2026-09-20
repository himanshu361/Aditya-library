import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

const API_BASE = 'http://localhost:8000/api'

type SecureNoteDetail = {
  id: number
  chapter_name: string
  subject: string
  class_number: number | null
  status: string
  purchase_status: string
  google_drive_file_id: string
  watermark: {
    name: string
    user_id: number
  }
  page_count: number
}

export default function SecureReader() {
  const { chapterId } = useParams()
  const [note, setNote] = useState<SecureNoteDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sessionActive, setSessionActive] = useState(true)
  const [sessionExpiresAt, setSessionExpiresAt] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token || !chapterId) {
      setError('Session expired. Please login again to continue reading.')
      setLoading(false)
      return
    }

    fetch(`${API_BASE}/student/notes/${chapterId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Unauthorized or unavailable')
        }
        return response.json()
      })
      .then(async (data) => {
        setNote(data)
        const sessionResponse = await fetch(`${API_BASE}/student/notes/${chapterId}/session`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        if (!sessionResponse.ok) {
          throw new Error('Secure session could not be created')
        }
        const sessionData = await sessionResponse.json()
        setSessionExpiresAt(sessionData.expires_at)
      })
      .catch(() => setError('Access denied or session expired. Please re-login to continue.'))
      .finally(() => setLoading(false))
  }, [chapterId])

  useEffect(() => {
    if (!chapterId || !sessionExpiresAt) return

    const timer = window.setInterval(async () => {
      const token = localStorage.getItem('access_token')
      if (!token) return

      try {
        const response = await fetch(`${API_BASE}/student/notes/${chapterId}/heartbeat`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          setSessionActive(false)
          return
        }

        const data = await response.json()
        setSessionExpiresAt(data.expires_at)
      } catch {
        setSessionActive(false)
      }
    }, 30000)

    return () => window.clearInterval(timer)
  }, [chapterId, sessionExpiresAt])

  const pagePreview = useMemo(
    () => Array.from({ length: 6 }, (_, index) => ({
      page: index + 1,
      title: note ? `${note.chapter_name} — Page ${index + 1}` : 'Secure page',
    })),
    [note],
  )

  if (loading) {
    return (
      <section className="mx-auto max-w-5xl py-16 text-center text-slate-200">
        Verifying purchase and preparing the protected reader...
      </section>
    )
  }

  if (error || !note) {
    return (
      <section className="mx-auto max-w-2xl py-16 text-center">
        <div className="glass rounded-[2rem] border border-rose-400/40 p-10">
          <h2 className="text-2xl font-bold text-rose-200">Access restricted</h2>
          <p className="mt-4 text-slate-200">{error || 'This chapter is not available for your account.'}</p>
          <Link to="/student/notes" className="mt-6 inline-block rounded-full bg-gradient-to-r from-sky-400 to-violet-400 px-5 py-3 font-semibold text-slate-950">
            Back to Secure Notes
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-8 py-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-sky-200">Protected Reader</p>
          <h2 className="mt-2 text-3xl font-bold">{note.chapter_name}</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/student/notes" className="rounded-full border border-white/15 px-4 py-2 text-sm">My Notes</Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="rounded-full bg-gradient-to-r from-sky-400 to-violet-400 px-4 py-2 font-semibold text-slate-950"
          >
            Close Reader
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glass rounded-[2rem] border border-white/10 p-5">
          <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-3 text-xs uppercase tracking-[0.25em] text-slate-300">
            <span>{note.subject}</span>
            <span>{note.class_number ? `Class ${note.class_number}` : 'General'}</span>
          </div>

          <div className="relative overflow-hidden rounded-[1.5rem] border border-sky-300/20 bg-slate-950/40 p-3">
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-[12px] uppercase tracking-[0.5em] text-sky-300/20">
              ADITYA TUITION CENTRE
            </div>
            <div className="absolute left-4 top-4 text-[10px] text-slate-300/80">Licensed to: {note.watermark.name}</div>
            <div className="absolute right-4 bottom-4 text-[10px] text-slate-300/80">UID: {note.watermark.user_id}</div>

            <div className="relative space-y-4 rounded-[1.2rem] border border-white/10 bg-slate-950/20 p-6 text-slate-100">
              <div className="text-xs uppercase tracking-[0.3em] text-sky-200">Preview</div>
              <h3 className="text-2xl font-bold">{note.chapter_name}</h3>
              <p className="text-sm text-slate-300">
                This note is protected and only available to verified students with a successful payment record.
              </p>

              {pagePreview.map((page) => (
                <div key={page.page} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-slate-400">
                    <span>Page {page.page}</span>
                    <span>Protected</span>
                  </div>
                  <div className="min-h-[110px] rounded-xl border border-dashed border-sky-300/20 bg-slate-900/50 p-3 text-sm text-slate-200">
                    {page.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="glass rounded-[2rem] border border-white/10 p-5">
            <div className="text-xs uppercase tracking-[0.25em] text-violet-200">Session</div>
            <div className="mt-5 text-sm text-slate-200">
              <div className="flex items-center justify-between">
                <span>Status</span>
                <span className={sessionActive ? 'text-emerald-300' : 'text-rose-300'}>
                  {sessionActive ? 'Active' : 'Expired'}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span>Expires</span>
                <span>{sessionExpiresAt ? new Date(sessionExpiresAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Pending'}</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span>Pages</span>
                <span>{note.page_count}</span>
              </div>
            </div>
          </div>

          <div className="glass rounded-[2rem] border border-white/10 p-5">
            <div className="text-xs uppercase tracking-[0.25em] text-sky-200">Download</div>
            <div className="mt-5 text-sm text-slate-200">
              Downloading is disabled for protected notes. Access is tracked and watermarked to the current student account.
            </div>
          </div>

          <div className="glass rounded-[2rem] border border-white/10 p-5">
            <div className="text-xs uppercase tracking-[0.25em] text-emerald-200">Access Log</div>
            <div className="mt-5 text-sm text-slate-200">
              Purchase verified: {note.purchase_status}
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

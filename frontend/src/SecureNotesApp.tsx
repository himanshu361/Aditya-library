import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_URL

type PurchasedChapter = {
  id: number
  chapter_id: number
  chapter_name: string
  subject: string
  class_number: number | null
  price: number
  status: string
  purchased_at: string | null
}

const formatDate = (value: string | null) => {
  if (!value) return 'N/A'
  try {
    return new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return value
  }
}

export default function SecureNotesApp() {
  const [chapters, setChapters] = useState<PurchasedChapter[]>([])
  const [selected, setSelected] = useState<PurchasedChapter | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      setError('Session expired. Please login again to continue reading.')
      setLoading(false)
      return
    }

    fetch(`${API_BASE}/student/notes`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Unauthorized access')
        }
        return response.json()
      })
      .then((data) => setChapters(data))
      .catch(() => setError('Session expired. Please login again to continue reading.'))
      .finally(() => setLoading(false))
  }, [])

  const totalAmount = useMemo(
    () => chapters.reduce((sum, chapter) => sum + chapter.price, 0),
    [chapters],
  )

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl py-16 text-center text-slate-200">
        Loading your secure notes...
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <div className="glass rounded-[2rem] border border-rose-400/40 p-10">
          <h2 className="text-2xl font-bold text-rose-200">Session expired.</h2>
          <p className="mt-4 text-slate-200">Please login again to continue reading.</p>
          <Link to="/login" className="mt-6 inline-block rounded-full bg-gradient-to-r from-sky-400 to-violet-400 px-5 py-3 font-semibold text-slate-950">
            Login Again
          </Link>
        </div>
      </div>
    )
  }

  return (
    <section className="space-y-8 py-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-sky-200">Secure Area</p>
          <h2 className="mt-2 text-3xl font-bold">My Secure Notes</h2>
        </div>
        <Link to="/notes" className="rounded-full border border-white/15 px-4 py-2 text-sm">Back to Notes</Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass card-3d rounded-3xl p-5">
          <div className="text-xs uppercase tracking-[0.25em] text-sky-200">Purchased</div>
          <div className="mt-6 text-3xl font-black">{chapters.length}</div>
        </div>
        <div className="glass card-3d rounded-3xl p-5">
          <div className="text-xs uppercase tracking-[0.25em] text-violet-200">Value</div>
          <div className="mt-6 text-3xl font-black">₹{totalAmount}</div>
        </div>
        <div className="glass card-3d rounded-3xl p-5">
          <div className="text-xs uppercase tracking-[0.25em] text-emerald-200">Status</div>
          <div className="mt-6 text-xl font-bold text-emerald-300">Verified</div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {chapters.map((chapter) => (
          <div key={chapter.chapter_id} className="glass card-3d rounded-[2rem] border border-white/10 p-5">
            <div className="text-xs uppercase tracking-[0.25em] text-sky-200">
              {chapter.class_number ? `Class ${chapter.class_number}` : 'Class'}
            </div>
            <h3 className="mt-5 text-xl font-bold">{chapter.subject}</h3>
            <p className="mt-3 text-lg font-semibold text-slate-100">{chapter.chapter_name}</p>
            <div className="mt-5 flex items-center justify-between text-sm text-slate-300">
              <span>✓ Purchased</span>
              <span>{formatDate(chapter.purchased_at)}</span>
            </div>
            <button
              type="button"
              onClick={() => setSelected(chapter)}
              className="mt-6 w-full rounded-full bg-gradient-to-r from-sky-400 to-violet-400 px-4 py-3 font-semibold text-slate-950"
            >
              Open Notes
            </button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="glass w-full max-w-2xl rounded-[2rem] border border-white/10 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-sky-200">Protected Reader</p>
                <h3 className="mt-2 text-2xl font-bold">{selected.chapter_name}</h3>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="rounded-full border border-white/15 px-3 py-1 text-sm">Close</button>
            </div>

            <div className="mt-6 rounded-2xl border border-sky-300/20 bg-sky-400/5 p-4 text-sm text-slate-200">
              <p className="font-semibold">Read Notes</p>
              <p className="mt-2">This protected viewer checks your verified purchase before allowing access.</p>
              <div className="mt-4 flex items-center justify-between">
                <span>{selected.subject}</span>
                <span className="text-emerald-300">₹{selected.price}</span>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/30 p-4">
              <div className="mb-3 text-sm uppercase tracking-[0.25em] text-sky-200">Dynamic watermark</div>
              <div className="relative h-72 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40">
                <div className="absolute inset-0 grid place-items-center text-[11px] uppercase tracking-[0.35em] text-sky-200/20">
                  ADITYA TUITION CENTRE
                </div>
                <div className="absolute left-4 top-4 text-[10px] text-slate-300/80">Licensed to: Student</div>
                <div className="absolute right-4 bottom-4 text-[10px] text-slate-300/80">User ID: {localStorage.getItem('user_id') || 'guest'}</div>
                <div className="absolute inset-0 flex items-center justify-center px-8 text-center text-lg text-slate-100/90">
                  Protected notes preview for {selected.chapter_name}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button type="button" onClick={() => setSelected(null)} className="rounded-full border border-white/10 px-4 py-2">Cancel</button>
              <Link to={`/student/notes/${selected.chapter_id}/reader`} onClick={() => setSelected(null)} className="rounded-full bg-gradient-to-r from-sky-400 to-violet-400 px-4 py-2 font-semibold text-slate-950">Open Reader</Link>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

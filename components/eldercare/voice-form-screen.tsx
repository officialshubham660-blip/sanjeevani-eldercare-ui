'use client'

import { useState } from 'react'
import { ArrowLeft, CalendarDays, Loader2, Mic, Square } from 'lucide-react'
import { registerUser, type RegistrationMode } from '@/lib/register-user'

const WAVE_BARS = [10, 22, 34, 18, 40, 26, 14, 36, 20, 30, 12, 24]

type Props = {
  onBack: () => void
  onNext: () => void
}

export function VoiceFormScreen({ onBack, onNext }: Props) {
  const [listening, setListening] = useState(false)
  const [form, setForm] = useState({ name: '', mobile: '', dob: '' })
  const [mode, setMode] = useState<RegistrationMode>('manual')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleListening() {
    if (listening) {
      setForm({ name: 'Shanti Devi', mobile: '9874563210', dob: '10/05/1958' })
      setMode('voice')
    }
    setListening((v) => !v)
  }

  function updateField(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
    setMode('manual')
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (saving) return
    setSaving(true)
    setError(null)
    const result = await registerUser({
      fullName: form.name,
      mobileNumber: form.mobile,
      dateOfBirth: form.dob,
      mode,
    })
    if (result.error) {
      setError(result.error)
      setSaving(false)
      return
    }
    onNext()
  }

  return (
    <main className="flex flex-col gap-6 px-5 pb-8 pt-4">
      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="flex size-12 items-center justify-center rounded-full text-[#14284b] hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1b7a4b]/40"
        >
          <ArrowLeft className="size-7" aria-hidden="true" />
        </button>
        <h1 className="text-2xl font-bold text-[#14284b]">Voice Registration</h1>
      </header>

      <section
        aria-label="Voice input"
        className="flex flex-col items-center gap-5 rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200"
      >
        <button
          type="button"
          onClick={toggleListening}
          aria-pressed={listening}
          aria-label={listening ? 'Stop listening and fill form' : 'Tap to speak'}
          className={`relative flex size-40 items-center justify-center rounded-full text-white shadow-xl transition-colors focus-visible:outline-none focus-visible:ring-8 focus-visible:ring-blue-300 ${
            listening ? 'bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {listening && <span className="absolute inset-0 animate-ping rounded-full bg-red-400/40" aria-hidden="true" />}
          <span className="absolute -inset-3 rounded-full border-8 border-blue-100" aria-hidden="true" />
          {listening ? (
            <Square className="relative size-14 fill-white" aria-hidden="true" />
          ) : (
            <Mic className="relative size-20" aria-hidden="true" />
          )}
        </button>

        <p className="text-2xl font-bold text-[#14284b]">{listening ? 'Listening…' : 'Tap to speak'}</p>

        <div className="flex h-12 items-center gap-1.5" aria-hidden="true">
          {WAVE_BARS.map((h, i) => (
            <span
              key={i}
              className={`w-2 rounded-full ${listening ? 'animate-pulse bg-blue-600' : 'bg-slate-300'}`}
              style={{ height: listening ? h : Math.max(6, h / 3), animationDelay: `${i * 90}ms` }}
            />
          ))}
        </div>

        <blockquote className="text-lg leading-relaxed text-slate-700">
          {'"My name is Shanti Devi. My mobile number is 9874563210. My date of birth is 10 05 1958."'}
        </blockquote>
      </section>

      <div className="flex items-center gap-3" role="separator">
        <span className="h-px flex-1 bg-slate-300" />
        <span className="text-lg font-semibold text-slate-600">Or fill manually</span>
        <span className="h-px flex-1 bg-slate-300" />
      </div>

      <form
        className="flex flex-col gap-5"
        onSubmit={handleSubmit}
        aria-busy={saving}
      >
        <Field label="Full Name" id="full-name">
          <input
            id="full-name"
            autoComplete="name"
            required
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Enter your name"
            className={inputClass}
          />
        </Field>

        <Field label="Mobile Number" id="mobile">
          <input
            id="mobile"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            required
            pattern="[0-9]{10}"
            value={form.mobile}
            onChange={(e) => updateField('mobile', e.target.value)}
            placeholder="Enter mobile number"
            className={inputClass}
          />
        </Field>

        <Field label="Date of Birth (DD/MM/YYYY)" id="dob">
          <div className="relative">
            <input
              id="dob"
              inputMode="numeric"
              required
              value={form.dob}
              onChange={(e) => updateField('dob', e.target.value)}
              placeholder="DD / MM / YYYY"
              className={`${inputClass} pr-14`}
            />
            <CalendarDays
              className="pointer-events-none absolute right-4 top-1/2 size-7 -translate-y-1/2 text-[#1b7a4b]"
              aria-hidden="true"
            />
          </div>
        </Field>

        {error && (
          <p role="alert" className="rounded-2xl border-2 border-red-300 bg-red-50 px-4 py-3 text-lg font-semibold text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="mt-2 flex min-h-16 items-center justify-center gap-3 rounded-2xl bg-[#1b7a4b] text-xl font-bold text-white shadow-md hover:bg-[#156239] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1b7a4b]/40 disabled:cursor-not-allowed disabled:opacity-80"
        >
          {saving ? (
            <>
              <Loader2 className="size-7 animate-spin" aria-hidden="true" />
              <span>Saving…</span>
            </>
          ) : (
            'Next'
          )}
        </button>
      </form>
    </main>
  )
}

const inputClass =
  'min-h-16 w-full rounded-2xl border-2 border-slate-400 bg-white px-4 text-lg text-[#14284b] placeholder:text-slate-500 focus:border-[#1b7a4b] focus:outline-none focus:ring-4 focus:ring-[#1b7a4b]/25'

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-lg font-semibold text-[#14284b]">
        {label} <span className="text-red-600" aria-hidden="true">*</span>
      </label>
      {children}
    </div>
  )
}

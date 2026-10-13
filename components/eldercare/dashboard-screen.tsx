'use client'

import {
  Bell,
  CalendarCheck,
  CalendarDays,
  Camera,
  CloudSun,
  GlassWater,
  House,
  ImageIcon,
  LayoutGrid,
  Menu,
  Mic,
  Pill,
  ScanLine,
  Smile,
  Users,
  HeartPulse,
  type LucideIcon,
} from 'lucide-react'
import { useState } from 'react'
import { Logo } from './logo'

type Feature = {
  title: string
  subtitle: string
  icon: LucideIcon
  card: string
  iconBg: string
}

const FEATURES: Feature[] = [
  { title: 'Medicine Cabinet', subtitle: 'View & manage medicines', icon: Pill, card: 'bg-red-50 ring-red-200', iconBg: 'bg-red-600' },
  { title: 'Appointments', subtitle: 'Doctor & checkups', icon: CalendarCheck, card: 'bg-blue-50 ring-blue-200', iconBg: 'bg-blue-600' },
  { title: 'Water Tracker', subtitle: 'Stay hydrated', icon: GlassWater, card: 'bg-cyan-50 ring-cyan-200', iconBg: 'bg-cyan-600' },
  { title: 'Wellbeing Check-In', subtitle: 'Mood & health', icon: Smile, card: 'bg-amber-50 ring-amber-200', iconBg: 'bg-amber-500' },
  { title: 'Talk to Sanjeevani', subtitle: 'Voice assistant', icon: Mic, card: 'bg-emerald-50 ring-emerald-200', iconBg: 'bg-[#1b7a4b]' },
  { title: 'Family Hub', subtitle: 'Messages & more', icon: Users, card: 'bg-violet-50 ring-violet-200', iconBg: 'bg-violet-600' },
]

const NAV = [
  { label: 'Home', icon: House },
  { label: 'Medicines', icon: Pill },
  { label: 'Appointments', icon: CalendarDays },
  { label: 'Wellbeing', icon: HeartPulse },
  { label: 'More', icon: LayoutGrid },
]

const FONT_SCALES = [0.9, 1, 1.15, 1.3]

export function DashboardScreen() {
  const [scaleIndex, setScaleIndex] = useState(1)
  const scale = FONT_SCALES[scaleIndex]

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-slate-200 bg-white px-3 py-3">
        <button type="button" aria-label="Open menu" className={iconBtn}>
          <Menu className="size-7" aria-hidden="true" />
        </button>
        <div className="flex-1">
          <Logo size="sm" />
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Decrease text size"
            disabled={scaleIndex === 0}
            onClick={() => setScaleIndex((i) => Math.max(0, i - 1))}
            className={`${iconBtn} text-sm font-bold disabled:opacity-40`}
          >
            A-
          </button>
          <button
            type="button"
            aria-label="Increase text size"
            disabled={scaleIndex === FONT_SCALES.length - 1}
            onClick={() => setScaleIndex((i) => Math.min(FONT_SCALES.length - 1, i + 1))}
            className={`${iconBtn} text-base font-bold disabled:opacity-40`}
          >
            A+
          </button>
          <button
            type="button"
            aria-label="Emergency SOS"
            className="flex size-12 items-center justify-center rounded-full bg-red-600 text-sm font-extrabold text-white shadow-md ring-4 ring-red-200 hover:bg-red-700 focus-visible:outline-none focus-visible:ring-red-400"
          >
            SOS
          </button>
          <button type="button" aria-label="Notifications, 3 unread" className={`${iconBtn} relative`}>
            <Bell className="size-6" aria-hidden="true" />
            <span className="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-white">
              3
            </span>
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-5 px-4 py-5" style={{ zoom: scale }}>
        <section className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#14284b] text-balance">Good Morning, Shanti Devi Ji!</h1>
            <p className="text-base text-slate-600">Stay healthy, stay happy!</p>
          </div>
          <div className="flex shrink-0 items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200">
            <CloudSun className="size-8 text-amber-500" aria-hidden="true" />
            <div className="leading-tight">
              <p className="text-lg font-bold text-[#14284b]">26°C</p>
              <p className="text-xs text-slate-500">Partly Cloudy</p>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-3xl bg-gradient-to-br from-[#14284b] to-blue-700 p-5 text-white shadow-lg">
          <div className="flex items-start gap-3">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
              <ScanLine className="size-8" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-bold">Scan Your Prescription</h2>
              <p className="text-base text-blue-100">Get AI help to understand your medicines</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" className={scanBtn}>
              <Camera className="size-6" aria-hidden="true" />
              Scan with Camera
            </button>
            <button type="button" className={scanBtn}>
              <ImageIcon className="size-6" aria-hidden="true" />
              Choose from Gallery
            </button>
          </div>
        </section>

        <section aria-label="Features" className="grid grid-cols-2 gap-3">
          {FEATURES.map(({ title, subtitle, icon: Icon, card, iconBg }) => (
            <button
              key={title}
              type="button"
              className={`flex min-h-32 flex-col items-start gap-3 rounded-2xl p-4 text-left ring-1 transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 ${card}`}
            >
              <span className={`flex size-12 items-center justify-center rounded-xl text-white ${iconBg}`}>
                <Icon className="size-7" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-base font-bold leading-snug text-[#14284b]">{title}</span>
                <span className="block text-sm text-slate-600">{subtitle}</span>
              </span>
            </button>
          ))}
        </section>
      </main>

      <nav aria-label="Primary" className="sticky bottom-0 grid grid-cols-5 border-t border-slate-200 bg-white px-1 pb-2 pt-2">
        {NAV.map(({ label, icon: Icon }, i) => {
          const active = i === 0
          return (
            <a
              key={label}
              href="#"
              aria-current={active ? 'page' : undefined}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-xs font-semibold ${
                active ? 'bg-emerald-50 text-[#1b7a4b]' : 'text-slate-500 hover:text-[#14284b]'
              }`}
            >
              <Icon className="size-6" aria-hidden="true" />
              {label}
            </a>
          )
        })}
      </nav>
    </div>
  )
}

const iconBtn =
  'flex size-11 items-center justify-center rounded-full text-[#14284b] hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1b7a4b]/40'

const scanBtn =
  'flex min-h-14 items-center justify-center gap-2 rounded-xl bg-white px-2 text-sm font-bold text-[#14284b] hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60'

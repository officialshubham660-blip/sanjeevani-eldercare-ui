'use client'

import { useState } from 'react'
import { WelcomeScreen } from './welcome-screen'
import { VoiceFormScreen } from './voice-form-screen'
import { DashboardScreen } from './dashboard-screen'

const SCREENS = [
  { id: 1, label: 'Screen 1' },
  { id: 4, label: 'Screen 4' },
  { id: 6, label: 'Screen 6' },
] as const

type ScreenId = (typeof SCREENS)[number]['id']

export function ScreenSwitcher() {
  const [active, setActive] = useState<ScreenId>(1)

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-slate-50 shadow-lg">
      <div role="tablist" aria-label="Mockup screens" className="grid grid-cols-3 gap-1 bg-[#14284b] p-1.5">
        {SCREENS.map((s) => (
          <button
            key={s.id}
            role="tab"
            type="button"
            aria-selected={active === s.id}
            onClick={() => setActive(s.id)}
            className={`min-h-11 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
              active === s.id ? 'bg-white text-[#14284b]' : 'text-white/80 hover:bg-white/10'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex-1" role="tabpanel">
        {active === 1 && <WelcomeScreen onSelectElderly={() => setActive(6)} onSelectVisuallyImpaired={() => setActive(4)} />}
        {active === 4 && <VoiceFormScreen onBack={() => setActive(1)} onNext={() => setActive(6)} />}
        {active === 6 && <DashboardScreen />}
      </div>
    </div>
  )
}

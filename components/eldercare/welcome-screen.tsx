import Image from 'next/image'
import { ChevronRight, Ear, UserRound } from 'lucide-react'
import { Logo } from './logo'

type Props = {
  onSelectElderly: () => void
  onSelectVisuallyImpaired: () => void
}

export function WelcomeScreen({ onSelectElderly, onSelectVisuallyImpaired }: Props) {
  return (
    <main className="flex flex-col gap-6 px-5 pb-8 pt-6">
      <header className="flex flex-col items-center gap-2 text-center">
        <Logo />
        <p className="text-sm font-medium text-slate-600">
          Healthy Seniors • Happier Families • A Safer Tomorrow
        </p>
      </header>

      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-emerald-50">
        <Image
          src="/images/elderly-couple.png"
          alt="A smiling elderly couple embracing in a garden"
          fill
          priority
          sizes="(max-width: 448px) 100vw, 448px"
          className="object-cover"
        />
      </div>

      <section className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-3xl font-bold text-[#14284b]">
          Namaste! <span aria-hidden="true">🙏</span>
        </h1>
        <p className="text-xl font-semibold text-[#14284b]">Welcome to Sanjeevani</p>
        <p className="text-base text-slate-600">Your personal health &amp; safety companion</p>
      </section>

      <nav aria-label="Choose your mode" className="flex flex-col gap-4">
        <button
          type="button"
          onClick={onSelectElderly}
          className="flex min-h-24 items-center gap-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4 text-left transition-colors hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1b7a4b]/40"
        >
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#1b7a4b] text-white">
            <UserRound className="size-8" aria-hidden="true" />
          </span>
          <span className="flex flex-1 flex-col gap-0.5">
            <span className="text-lg font-bold text-[#1b7a4b]">For Elderly / Enter Paper</span>
            <span className="text-sm text-slate-600">I am an elderly user or registering for someone</span>
          </span>
          <ChevronRight className="size-6 text-[#1b7a4b]" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={onSelectVisuallyImpaired}
          className="flex min-h-24 items-center gap-4 rounded-2xl border-2 border-violet-200 bg-violet-50 p-4 text-left transition-colors hover:bg-violet-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-500/40"
        >
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-violet-700 text-white">
            <Ear className="size-8" aria-hidden="true" />
          </span>
          <span className="flex flex-1 flex-col gap-0.5">
            <span className="text-lg font-bold text-violet-800">For Visually Impaired</span>
            <span className="text-sm text-slate-600">Simple &amp; accessible mode for better ease</span>
          </span>
          <ChevronRight className="size-6 text-violet-700" aria-hidden="true" />
        </button>
      </nav>

      <footer className="text-center text-sm text-slate-500">
        Together for a healthier tomorrow <span aria-hidden="true">❤️</span>
      </footer>
    </main>
  )
}

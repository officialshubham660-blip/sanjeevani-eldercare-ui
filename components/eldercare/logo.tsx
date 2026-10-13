import { HeartHandshake } from 'lucide-react'

export function Logo({ size = 'lg' }: { size?: 'sm' | 'lg' }) {
  const isLarge = size === 'lg'
  return (
    <div className="flex items-center gap-2">
      <span
        className={`flex shrink-0 items-center justify-center rounded-full bg-[#1b7a4b] text-white ${
          isLarge ? 'size-12' : 'size-9'
        }`}
        aria-hidden="true"
      >
        <HeartHandshake className={isLarge ? 'size-7' : 'size-5'} />
      </span>
      <span className="flex flex-col leading-tight">
        <span className={`font-bold text-[#1b7a4b] ${isLarge ? 'text-2xl' : 'text-base'}`}>Sanjeevani</span>
        <span className={`font-semibold text-[#14284b] ${isLarge ? 'text-lg' : 'text-sm'}`}>ElderCare+</span>
      </span>
    </div>
  )
}

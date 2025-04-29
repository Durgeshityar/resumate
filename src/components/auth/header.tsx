import { Poppins } from 'next/font/google'

import { cn } from '@/lib/utils'

const font = Poppins({
  subsets: ['latin'],
  weight: ['600'],
})

interface HeaderProps {
  label: string
}

const Logo = () => {
  return (
    <div className="relative h-8 w-8 mr-2">
      <div className="absolute inset-0 bg-black rounded-[5px]"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-bold">R</span>
      </div>
    </div>
  )
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1
        className={cn(' font-semibold flex items-center gap-1', font.className)}
      >
        <Logo />
        <span className="text-2xl">ResuMate</span>
      </h1>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  )
}

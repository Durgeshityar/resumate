import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { cookies } from 'next/headers'

interface ProtectedLayoutProps {
  children: React.ReactNode
}

const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true'
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className="flex-1 w-full">
        <SidebarTrigger className="h-8 w-auto mx-4 mt-2" />
        {children}
      </main>
    </SidebarProvider>
  )
}

export default ProtectedLayout

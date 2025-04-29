import { ChevronUp, User2, FileUser, Notebook, Terminal } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { currentUser } from '@/lib/auth-util'
import { LogoutButton } from './auth/logout-button'
import Link from 'next/link'
import { fetchSubscriptionDetails } from '@/actions/user/subscription-actions'
import { Badge } from './ui/badge'

const items = [
  {
    title: 'Resume',
    url: '/resumes',
    icon: FileUser,
  },
  {
    title: 'Cover Letter',
    url: '/cover-letters',
    icon: Notebook,
  },
  {
    title: 'Job Board',
    url: '/job-board',
    icon: Terminal,
  },
]
const Logo = async () => {
  const { isSubscribed } = await fetchSubscriptionDetails()
  return (
    <Link href="/" className="flex items-center ">
      <div className="h-8 w-8 min-h-8 min-w-8 flex-shrink-0 bg-black rounded-md flex items-center justify-center mr-2">
        <span className={`text-white font-bold`}>R</span>
      </div>
      <span
        className={`text-black font-bold text-xl md:group-data-[state=expanded]:block md:hidden block`}
      >
        Resumate
      </span>
      <Badge
        variant="outline"
        className="ml-2 md:group-data-[state=expanded]:block md:hidden block"
      >
        {isSubscribed ? 'pro' : ''}
      </Badge>
    </Link>
  )
}

export async function AppSidebar() {
  const user = await currentUser()
  const { isSubscribed } = await fetchSubscriptionDetails()

  return (
    <Sidebar collapsible="icon" className="flex md:flex">
      <SidebarContent>
        <SidebarHeader className=" cursor-pointer">
          <Logo />
        </SidebarHeader>

        <SidebarGroup>
          <SidebarGroupLabel>Products</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton tooltip={item.title} asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {user?.name}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <Link href="/billing">
                  <DropdownMenuItem>
                    <span>Billing</span>
                  </DropdownMenuItem>
                </Link>
                <LogoutButton>
                  <DropdownMenuItem>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </LogoutButton>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

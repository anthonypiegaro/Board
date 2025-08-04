import Link from "next/link"
import { Dice6, Folder, LayoutDashboard, SquareKanban } from "lucide-react"

import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"

const menuItems = [
  {
    name: "Dashboard",
    url: "/dashboard",
    icon: <LayoutDashboard />
  },
  {
    name: "Projects",
    url: "/dashboard/projects",
    icon: <Folder />
  },
  {
    name: "Boards",
    url: "/dashboard/boards",
    icon: <Dice6 />
  }
]

export function AppSidebar() {
  return (
    <Sidebar variant="inset">
      <SidebarHeader className="flex flex-row items-center text-lg font-medium justify-center pb-0 pt-3">
        <SquareKanban />
        Board
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      {item.icon}
                      <span>
                        {item.name}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
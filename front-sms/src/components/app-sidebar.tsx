"use client"

import * as React from "react"
import {
  AlertCircle,
  BookOpen,
  ClipboardList,
  Command,
  FileText,
  GraduationCap,
  Home,
  User,
  Users,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useSelector } from "react-redux"
import { selectUserLogin } from "@/redux/features/userSlice"



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {


  const userLogin = useSelector(selectUserLogin);

  console.log("User Login in Sidebar:", userLogin);

  const userRole = userLogin?.rol || "ADMIN";

const fullNav = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
    items: [{ title: "Inicio", url: "/dashboard" }],
  },
  {
    title: "Classes",
    url: "/dashboard/clases",
    icon: BookOpen,
    rol: ["ADMIN", "SUPER_ADMIN", "DOCENTE"],
    items: [{ 
      title: "Listado de clases", 
      url: "/dashboard/clases" }, 
      { 
        title: "Nueva clase", 
        url: "/dashboard/clases/nuevo",
      }],
  },
  {
    title: "Subjects",
    url: "/dashboard/subjects",
    icon: ClipboardList,
    rol: ["ADMIN", "SUPER_ADMIN"],
    items: [{ title: "Listado de materias", url: "/dashboard/subjects" }],
  },
  {
    title: "Teachers",
    url: "/dashboard/teachers",
    icon: Users,
    rol: ["ADMIN", "SUPER_ADMIN"],
    items: [{ title: "Listado de docentes", url: "/dashboard/teachers" }],
  },
  {
    title: "Students",
    url: "/dashboard/students",
    icon: GraduationCap,
    rol: ["ADMIN", "SUPER_ADMIN", "DOCENTE"],
    items: [{ 
      title: "Listado de estudiantes", 
      url: "/dashboard/students" },
    {
      title: "Nuevo estudiante",
      url: "/dashboard/students/nuevo",
    }],
  },
  {
    title: "Notices",
    url: "/dashboard/notices",
    icon: FileText,
    rol: ["ADMIN", "SUPER_ADMIN", "DOCENTE"],
    items: [{ title: "Comunicados", url: "/dashboard/notices" }],
  },
  {
    title: "Complains",
    url: "/dashboard/complains",
    icon: AlertCircle,
    rol: ["ADMIN", "SUPER_ADMIN"],
    items: [{ title: "Reclamos", url: "/dashboard/complains" }],
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: User,
    items: [{ title: "Mi perfil", url: "/dashboard/profile" }],
  },
];

  // Filter the navigation items based on user rol
  const navMain = fullNav.filter(
    (item) => !item.rol || item.rol.includes(userRole),
  );

  // This is sample data.
const data = {
   user: {
      name: userLogin?.nombre || "Shadcn",
      email: userLogin?.email || "m@example.com",
      rol: userLogin?.rol || "SUPER_ADMIN",
      avatar:
        userLogin?.avatar || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
  },
  teams: [
    {
      name: "Sistema de gestión",
      logo: Command,
      plan: "escolar",
    },
  ],
  navMain
}


  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

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
import { LucideIcon } from "lucide-react"

type UserRole = 'ADMIN' | 'DOCENTE' | 'SUPERADMIN';

interface NavItem {
  title: string;
  url: string;
  rol?: UserRole[];
}

interface NavSection {
  title: string;
  url: string;
  icon: LucideIcon;
  rol?: UserRole[];
  items?: NavItem[];
}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {


  const userLogin = useSelector(selectUserLogin);

  console.log("User Login in Sidebar:", userLogin);

  const userRole = userLogin?.rol || "ADMIN";

const fullNav: NavSection[] = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
    items: [{ title: "Inicio", url: "/dashboard" }],
  },
  {
    title: "Clases",
    url: "/dashboard/clases",
    icon: BookOpen,
    rol: ["ADMIN", "SUPERADMIN", "DOCENTE"],
    items: [
      { 
        title: "Listado de clases", 
        url: "/dashboard/clases",
        rol: ["ADMIN", "SUPERADMIN"],
      },
      { 
        title: "Mis Clases", 
        url: "/dashboard/clases/mis-clases",
        rol: ["ADMIN", "SUPERADMIN", "DOCENTE"],
      },
      { 
        title: "Nueva clase", 
        url: "/dashboard/clases/nuevo",
        rol: ["ADMIN", "SUPERADMIN"],
      }
    ],
  },
  {
    title: "Materias",
    url: "/dashboard/materias",
    icon: ClipboardList,
    rol: ["ADMIN", "SUPERADMIN", "DOCENTE"],
    items: [
      { title: "Listado de materias", 
        url: "/dashboard/materias",
        rol: ["ADMIN", "SUPERADMIN"],
      },
      {
        title: "Mis materias",
        url: "/dashboard/materias/mis-materias",
        rol: ["ADMIN", "SUPERADMIN", "DOCENTE"],
      },
      {
        title: "Nueva materia",
        url: "/dashboard/materias/nueva",
        rol: ["ADMIN", "SUPERADMIN"],
      }
      ],
  },
  {
    title: "Usuarios",
    url: "/dashboard/usuarios",
    icon: Users,
    rol: ["ADMIN", "SUPERADMIN"],
    items: [{ 
      title: "Listado de usuarios", 
      url: "/dashboard/usuarios" },
      {
        title: "Maestros",
        url: "/dashboard/usuarios/maestros",
      },
    {
      title: "Nuevo usuario",
      url: "/dashboard/usuarios/nuevo",
    }],
  },
  {
    title: "Alumnos",
    url: "/dashboard/alumnos",
    icon: GraduationCap,
    rol: ["ADMIN", "SUPERADMIN", "DOCENTE"],
    items: [{ 
      title: "Listado de alumnos", 
      url: "/dashboard/alumnos" },
    {
      title: "Nuevo alumnos",
      url: "/dashboard/alumnos/nuevo",
    }],
  },
  {
    title: "Notices",
    url: "/dashboard/notices",
    icon: FileText,
    rol: ["ADMIN", "SUPERADMIN", "DOCENTE"],
    items: [{ title: "Comunicados", url: "/dashboard/notices" }],
  },
  {
    title: "Complains",
    url: "/dashboard/complains",
    icon: AlertCircle,
    rol: ["ADMIN", "SUPERADMIN"],
    items: [{ title: "Reclamos", url: "/dashboard/complains" }],
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: User,
    items: [{ title: "Mi perfil", url: "/dashboard/profile" }],
  },
];


const navMain = fullNav
  .filter((item) => !item.rol || item.rol.includes(userRole))
  .map((item) => {
    if (item.items) {
      return {
        ...item,
        items: item.items.filter(
          (subItem) => !subItem.rol || subItem.rol.includes(userRole)
        ),
      };
    }
    return item;
  });


  // This is sample data.
const data = {
   user: {
      name: userLogin?.nombre || "Shadcn",
      email: userLogin?.email || "m@example.com",
      rol: userLogin?.rol || "SUPERADMIN",
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

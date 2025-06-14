
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Archive,
  Calculator,
  CalendarDays,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { BrickIcon } from "@/components/icons/brick-icon";


export const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/projects",
    label: "Projetos",
    icon: Briefcase,
  },
  {
    href: "/dashboard/resources",
    label: "Recursos",
    icon: Archive,
  },
  {
    href: "/dashboard/calculators/wall",
    label: "Calculadora de Muro",
    icon: BrickIcon,
    customIcon: true,
  },
  {
    href: "/dashboard/schedule",
    label: "Agenda e Alertas",
    icon: CalendarDays,
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.label}>
          <Link href={item.href} asChild>
            <SidebarMenuButton
              asChild
              className={cn(
                "w-full justify-start",
                pathname === item.href && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
              )}
              tooltip={item.label}
              isActive={pathname === item.href}
            >
              <a>
                <item.icon className="mr-2 h-5 w-5 flex-shrink-0" />
                <span className="truncate font-body">{item.label}</span>
              </a>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}


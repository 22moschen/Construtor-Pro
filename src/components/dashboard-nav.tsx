"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Archive,
  // Calculator, // Removido se não usado diretamente aqui
  CalendarDays,
  // Settings, // Removido se não usado diretamente aqui
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"; // Supondo que estes vêm de shadcn/ui ou similar
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
    icon: BrickIcon, // BrickIcon é usado como um componente
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
          <Link href={item.href} legacyBehavior={false}> {/* legacyBehavior={false} é o padrão em Next 13+ App Router */}
            {/* O SidebarMenuButton agora é um filho direto do Link.
                O Link do Next.js renderizará uma tag <a> e o SidebarMenuButton
                será o conteúdo dessa tag <a>.
                Remova 'asChild' do SidebarMenuButton se ele não precisar passar
                suas props para os filhos diretos (ícone e span) de forma especial.
                Se SidebarMenuButton for, por exemplo, um <button> da biblioteca de UI,
                o Link do Next.js vai envolvê-lo em um <a>.
            */}
            <SidebarMenuButton
              // asChild <-- REMOVA ESTE 'asChild' do SidebarMenuButton
              className={cn(
                "w-full justify-start", // Garanta que este estilo seja aplicado ao <a> ou ao botão interno
                pathname === item.href && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
              )}
              tooltip={item.label}
              isActive={pathname === item.href}
              // A biblioteca de UI (shadcn/ui Button por exemplo) pode precisar que você passe
              // o href para ele também se você quiser que ele se estilize como um link
              // ou pode ser que o Link do Next.js cuide disso.
              // Tente primeiro sem passar o href para o SidebarMenuButton.
            >
              <item.icon className="mr-2 h-5 w-5 flex-shrink-0" />
              <span className="truncate font-body">{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
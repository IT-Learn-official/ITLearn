"use client";

import { Home01Icon, TestTube01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavUser } from "@/components/dashboard/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navMain = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home01Icon,
  },
  {
    title: "Test",
    href: "/dashboard/test",
    icon: TestTube01Icon,
  },
];

export function AppSidebar(
  props: React.ComponentProps<typeof Sidebar>
): React.ReactElement {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offExamples" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link className="flex items-center gap-2" href="/dashboard">
                <Image
                  alt="IT Learn logo"
                  height={16}
                  src="/logo.png"
                  width={16}
                />
                <span className="font-semibold">IT Learn</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="px-2">
          {navMain.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname?.startsWith(item.href);

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.title}
                >
                  <Link className="flex items-center gap-2" href={item.href}>
                    {Icon ? (
                      <HugeiconsIcon
                        color="currentColor"
                        icon={Icon}
                        size={16}
                        strokeWidth={1.5}
                      />
                    ) : null}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

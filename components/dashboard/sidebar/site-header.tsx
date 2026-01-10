"use client";

import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardSiteHeader() {
  const pathname = usePathname();

  const segments = useMemo(() => {
    if (!pathname) {
      return [{ label: "Dashboard", href: "/dashboard" }];
    }

    if (pathname.startsWith("/dashboard/scripts")) {
      return [
        { label: "Dashboard", href: "/dashboard" },
        { label: "My Scripts", href: "/dashboard/scripts" },
      ];
    }

    return [{ label: "Dashboard", href: "/dashboard" }];
  }, [pathname]);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          className="mx-2 data-[orientation=vertical]:h-4"
          orientation="vertical"
        />
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1 font-medium text-muted-foreground text-xs sm:text-sm"
        >
          {segments.map((segment, index) => (
            <span className="flex items-center gap-1" key={segment.href}>
              {index > 0 ? (
                <HugeiconsIcon
                  color="currentColor"
                  icon={ArrowRight01Icon}
                  size={14}
                  strokeWidth={1.75}
                />
              ) : null}
              <Link
                className="transition-colors hover:text-foreground"
                href={segment.href}
              >
                {segment.label}
              </Link>
            </span>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button asChild className="hidden sm:flex" size="sm" variant="ghost">
            <a
              className="dark:text-foreground"
              href="https://nighty.timrodina.online"
              rel="noopener noreferrer"
              target="_blank"
            >
              Docs
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}

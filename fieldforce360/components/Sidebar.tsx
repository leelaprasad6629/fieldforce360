"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  ClipboardList,
  Users,
  BarChart3,
  FileText,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type SidebarNavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
};

const navItems: SidebarNavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    name: "Live Map",
    href: "/livemap",
    icon: <Map className="w-5 h-5" />,
  },
  {
    name: "Service Requests",
    href: "/requests",
    icon: <ClipboardList className="w-5 h-5" />,
  },
  {
    name: "Technicians",
    href: "/technicians",
    icon: <Users className="w-5 h-5" />,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: <FileText className="w-5 h-5" />,
  },
];

// TODO: Replace with actual user role from context/auth
const USER_ROLE = "Manager"; // or "Technician"

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-full w-64 flex flex-col border-r bg-background shadow-sm">
      {/* Logo/Header */}
      <div className="flex items-center gap-2 px-6 py-5 border-b">
        <UserCircle className="w-7 h-7 text-primary" />
        <span className="font-semibold text-lg">FieldForce360</span>
        <Badge
          variant={USER_ROLE === "Manager" ? "default" : "secondary"}
          className="ml-auto px-2 py-0.5 text-xs font-medium rounded"
        >
          {USER_ROLE}
        </Badge>
      </div>
      {/* Navigation */}
      <nav className="flex-1 flex flex-col py-4 px-2 gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors font-medium",
                isActive
                  ? "bg-primary text-primary-foreground shadow"
                  : "hover:bg-muted hover:text-primary text-muted-foreground"
              )}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
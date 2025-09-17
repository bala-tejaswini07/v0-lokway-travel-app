"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, MapPin, Calendar, CreditCard, User } from "lucide-react"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/transport", label: "Transport", icon: MapPin },
  { href: "/itinerary", label: "Itinerary", icon: Calendar },
  { href: "/bookings", label: "Bookings", icon: CreditCard },
  { href: "/profile", label: "Profile", icon: User },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-card border-t border-border">
      <div className="flex justify-around items-center py-2">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
              pathname === href ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

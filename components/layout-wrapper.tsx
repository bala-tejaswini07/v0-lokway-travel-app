import type React from "react"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { SOSButton } from "@/components/sos-button"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <div className="md:hidden">
        <Navigation />
      </div>
      <SOSButton />
    </div>
  )
}

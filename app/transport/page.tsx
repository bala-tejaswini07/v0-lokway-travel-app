import { LayoutWrapper } from "@/components/layout-wrapper"
import { TransportMap } from "@/components/transport-map"
import { TransportFilters } from "@/components/transport-filters"
import { TransportList } from "@/components/transport-list"

export default function TransportPage() {
  return (
    <LayoutWrapper>
      <div className="h-full">
        <div className="p-4 border-b border-border">
          <h1 className="text-2xl font-bold text-foreground mb-4">Find Transport</h1>
          <TransportFilters />
        </div>
        <div className="flex flex-col lg:flex-row h-[calc(100vh-200px)]">
          <div className="lg:w-2/3 h-64 lg:h-full">
            <TransportMap />
          </div>
          <div className="lg:w-1/3 h-full overflow-y-auto">
            <TransportList />
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}

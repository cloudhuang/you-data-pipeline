"use client"

import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import DataSourceSidebar from "./data-source-sidebar"
import PipelineFlow from "./pipeline-flow"

export default function DataPipelineDesigner() {
  const [selectedNode, setSelectedNode] = useState<any>(null)

  return (
    <div className="h-full w-full flex overflow-hidden">
      <SidebarProvider defaultOpen={true}>
        <DataSourceSidebar onSelectNode={setSelectedNode} />
        <div className="h-full w-full overflow-hidden" style={{ position: 'relative' }}>
          <PipelineFlow selectedNode={selectedNode} />
        </div>
      </SidebarProvider>
    </div>
  )
}

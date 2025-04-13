"use client"

import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import DataSourceSidebar from "./data-source-sidebar"
import PipelineFlow from "./pipeline-flow"

export default function DataPipelineDesigner() {
  const [selectedNode, setSelectedNode] = useState<any>(null)

  return (
    <div className="h-full">
      <SidebarProvider defaultOpen={true}>
        <DataSourceSidebar onSelectNode={setSelectedNode} />
        <div className="ml-64 h-full">
          <PipelineFlow selectedNode={selectedNode} />
        </div>
      </SidebarProvider>
    </div>
  )
}

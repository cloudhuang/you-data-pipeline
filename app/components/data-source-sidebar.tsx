"use client"

import type React from "react"

import { useState } from "react"
import { Search, Database, Server, FileText, Globe, HardDrive } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInput,
} from "@/components/ui/sidebar"

// Define data source types
const dataSources = {
  jdbc: [
    { id: "mysql", name: "MySQL", icon: Database, color: "#00758F" },
    { id: "postgresql", name: "PostgreSQL", icon: Database, color: "#336791" },
    { id: "oracle", name: "Oracle", icon: Database, color: "#F80000" },
    { id: "sqlserver", name: "SQL Server", icon: Database, color: "#CC2927" },
    { id: "db2", name: "DB2", icon: Database, color: "#00539F" },
  ],
  bigdata: [
    { id: "hadoop", name: "Hadoop HDFS", icon: HardDrive, color: "#FF7A00" },
    { id: "spark", name: "Spark", icon: HardDrive, color: "#E25A1C" },
    { id: "hive", name: "Hive", icon: HardDrive, color: "#FDEE21" },
    { id: "impala", name: "Impala", icon: HardDrive, color: "#00BFFF" },
  ],
  nosql: [
    { id: "mongodb", name: "MongoDB", icon: Database, color: "#4DB33D" },
    { id: "cassandra", name: "Cassandra", icon: Database, color: "#1287B1" },
    { id: "redis", name: "Redis", icon: Database, color: "#D82C20" },
    { id: "elasticsearch", name: "Elasticsearch", icon: Database, color: "#FEC514" },
    { id: "dynamodb", name: "DynamoDB", icon: Database, color: "#4053D6" },
  ],
  file: [
    { id: "s3", name: "Amazon S3", icon: FileText, color: "#FF9900" },
    { id: "ftp", name: "FTP/SFTP", icon: FileText, color: "#0078D7" },
    { id: "hdfs", name: "HDFS", icon: FileText, color: "#FF7A00" },
    { id: "azure-blob", name: "Azure Blob", icon: FileText, color: "#0089D6" },
    { id: "gcs", name: "Google Cloud Storage", icon: FileText, color: "#4285F4" },
  ],
  api: [
    { id: "rest", name: "REST API", icon: Globe, color: "#61DAFB" },
    { id: "graphql", name: "GraphQL", icon: Globe, color: "#E535AB" },
    { id: "soap", name: "SOAP", icon: Globe, color: "#0078D7" },
    { id: "odata", name: "OData", icon: Globe, color: "#0078D7" },
    { id: "kafka", name: "Kafka", icon: Server, color: "#000000" },
    { id: "rabbitmq", name: "RabbitMQ", icon: Server, color: "#FF6600" },
  ],
}

interface DataSourceSidebarProps {
  onSelectNode: (node: any) => void
}

export default function DataSourceSidebar({ onSelectNode }: DataSourceSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleDragStart = (event: React.DragEvent, nodeType: string, nodeData: any) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.setData("nodeData", JSON.stringify(nodeData))
    event.dataTransfer.effectAllowed = "move"
  }

  const handleNodeClick = (nodeType: string, nodeData: any) => {
    onSelectNode({ type: nodeType, ...nodeData })
  }

  const filteredSources = Object.entries(dataSources).reduce(
    (acc, [category, sources]) => {
      const filtered = sources.filter((source) => source.name.toLowerCase().includes(searchTerm.toLowerCase()))
      if (filtered.length > 0) {
        acc[category] = filtered
      }
      return acc
    },
    {} as Record<string, (typeof dataSources)[keyof typeof dataSources]>,
  )

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader>
        <div className="p-2">
          <h2 className="text-xl font-bold mb-2">Data Pipeline Designer</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <SidebarInput
              placeholder="Search data sources..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {Object.entries(filteredSources).length === 0 && searchTerm && (
          <div className="p-4 text-center text-gray-500">No data sources found</div>
        )}

        {Object.entries(filteredSources).map(([category, sources]) => (
          <SidebarGroup key={category}>
            <SidebarGroupLabel className="capitalize">
              {category === "jdbc"
                ? "Relational Databases"
                : category === "bigdata"
                  ? "Big Data"
                  : category === "nosql"
                    ? "NoSQL Databases"
                    : category === "file"
                      ? "File Systems"
                      : category === "api"
                        ? "APIs & Message Queues"
                        : category}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {sources.map((source) => (
                  <SidebarMenuItem key={source.id}>
                    <SidebarMenuButton
                      draggable
                      onDragStart={(e) => handleDragStart(e, category, source)}
                      onClick={() => handleNodeClick(category, source)}
                      className="cursor-grab"
                    >
                      <source.icon className="h-4 w-4 mr-2 shrink-0" style={{ color: source.color }} />
                      <span>{source.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        <SidebarGroup>
          <SidebarGroupLabel>Transformations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  draggable
                  onDragStart={(e) => handleDragStart(e, "transform", { id: "filter", name: "Filter" })}
                  onClick={() => handleNodeClick("transform", { id: "filter", name: "Filter" })}
                  className="cursor-grab"
                >
                  <span>Filter</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  draggable
                  onDragStart={(e) => handleDragStart(e, "transform", { id: "join", name: "Join" })}
                  onClick={() => handleNodeClick("transform", { id: "join", name: "Join" })}
                  className="cursor-grab"
                >
                  <span>Join</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  draggable
                  onDragStart={(e) => handleDragStart(e, "transform", { id: "aggregate", name: "Aggregate" })}
                  onClick={() => handleNodeClick("transform", { id: "aggregate", name: "Aggregate" })}
                  className="cursor-grab"
                >
                  <span>Aggregate</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Destinations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  draggable
                  onDragStart={(e) => handleDragStart(e, "destination", { id: "warehouse", name: "Data Warehouse" })}
                  onClick={() => handleNodeClick("destination", { id: "warehouse", name: "Data Warehouse" })}
                  className="cursor-grab"
                >
                  <Database className="h-4 w-4 mr-2 shrink-0" />
                  <span>Data Warehouse</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  draggable
                  onDragStart={(e) => handleDragStart(e, "destination", { id: "lake", name: "Data Lake" })}
                  onClick={() => handleNodeClick("destination", { id: "lake", name: "Data Lake" })}
                  className="cursor-grab"
                >
                  <HardDrive className="h-4 w-4 mr-2 shrink-0" />
                  <span>Data Lake</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

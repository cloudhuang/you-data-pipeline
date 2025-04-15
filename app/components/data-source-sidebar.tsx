"use client"

import type React from "react"

import { useState } from "react"
import { Search, Database, Server, FileText, Globe, HardDrive, Clock, Shield, BarChart } from "lucide-react"
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

// 定义数据源类型
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

// 同步策略
const syncStrategies = [
  { id: "full", name: "全量同步", description: "完整复制源数据", icon: Clock },
  { id: "incremental", name: "增量同步", description: "基于时间戳或主键", icon: Clock },
  { id: "cdc", name: "CDC实时同步", description: "实时捕获数据变更", icon: Clock },
  { id: "hybrid", name: "混合模式", description: "先全量后增量", icon: Clock },
]

// 数据质量规则
const qualityRules = [
  { id: "completeness", name: "完整性检查", description: "检查必填字段是否有空值", icon: Shield },
  { id: "consistency", name: "一致性验证", description: "验证源目标数据一致性", icon: Shield },
  { id: "validity", name: "有效性检查", description: "检查数据是否符合业务规则", icon: Shield },
  { id: "accuracy", name: "准确性检查", description: "检查数据是否准确反映业务事实", icon: Shield },
]

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
          <h2 className="text-xl font-bold mb-2 flex items-center">
            <Database className="h-5 w-5 mr-2 text-blue-600" />
            数据源管理
          </h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <SidebarInput
              placeholder="搜索数据源..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {Object.entries(filteredSources).length === 0 && searchTerm && (
          <div className="p-4 text-center text-gray-500">未找到数据源</div>
        )}

        {Object.entries(filteredSources).map(([category, sources]) => (
          <SidebarGroup key={category}>
            <SidebarGroupLabel className="capitalize">
              {category === "jdbc"
                ? "关系型数据库"
                : category === "bigdata"
                  ? "大数据平台"
                  : category === "nosql"
                    ? "NoSQL数据库"
                    : category === "file"
                      ? "文件系统"
                      : category === "api"
                        ? "API与消息队列"
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
          <SidebarGroupLabel>同步策略</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {syncStrategies.map((strategy) => (
                <SidebarMenuItem key={strategy.id}>
                  <SidebarMenuButton className="cursor-pointer">
                    <strategy.icon className="h-4 w-4 mr-2 shrink-0 text-blue-600" />
                    <div className="flex flex-col">
                      <span>{strategy.name}</span>
                      <span className="text-xs text-gray-500">{strategy.description}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>数据转换</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  draggable
                  onDragStart={(e) => handleDragStart(e, "transform", { id: "filter", name: "数据过滤" })}
                  onClick={() => handleNodeClick("transform", { id: "filter", name: "数据过滤" })}
                  className="cursor-grab"
                >
                  <span>数据过滤</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  draggable
                  onDragStart={(e) => handleDragStart(e, "transform", { id: "join", name: "数据关联" })}
                  onClick={() => handleNodeClick("transform", { id: "join", name: "数据关联" })}
                  className="cursor-grab"
                >
                  <span>数据关联</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  draggable
                  onDragStart={(e) => handleDragStart(e, "transform", { id: "aggregate", name: "数据聚合" })}
                  onClick={() => handleNodeClick("transform", { id: "aggregate", name: "数据聚合" })}
                  className="cursor-grab"
                >
                  <span>数据聚合</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>数据质量</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {qualityRules.map((rule) => (
                <SidebarMenuItem key={rule.id}>
                  <SidebarMenuButton className="cursor-pointer">
                    <rule.icon className="h-4 w-4 mr-2 shrink-0 text-green-600" />
                    <div className="flex flex-col">
                      <span>{rule.name}</span>
                      <span className="text-xs text-gray-500">{rule.description}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>贴源层</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  draggable
                  onDragStart={(e) => handleDragStart(e, "destination", { id: "warehouse", name: "数据仓库贴源层" })}
                  onClick={() => handleNodeClick("destination", { id: "warehouse", name: "数据仓库贴源层" })}
                  className="cursor-grab"
                >
                  <Database className="h-4 w-4 mr-2 shrink-0 text-green-600" />
                  <span>数据仓库贴源层</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  draggable
                  onDragStart={(e) => handleDragStart(e, "destination", { id: "lake", name: "数据湖贴源层" })}
                  onClick={() => handleNodeClick("destination", { id: "lake", name: "数据湖贴源层" })}
                  className="cursor-grab"
                >
                  <HardDrive className="h-4 w-4 mr-2 shrink-0 text-green-600" />
                  <span>数据湖贴源层</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

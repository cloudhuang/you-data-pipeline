"use client"

import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import DataSourceSidebar from "./data-source-sidebar"
import DataMirrorFlow from "./data-mirror-flow"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Database, FileText, Globe, HardDrive, Server, Save, Play, Settings, RefreshCw, Eye, Plus, ArrowRight, FileJson, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"

export default function DataMirrorDesigner() {
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("design")
  const [selectedSource, setSelectedSource] = useState<string | null>(null)

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 overflow-hidden">
        {/* Header with product name and tabs */}
        <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center">
            <Database className="h-6 w-6 mr-2 text-blue-600" />
            <h1 className="text-xl font-bold">DataMirror</h1>
            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">数据镜像</span>
          </div>
          
          <TabsList>
            <TabsTrigger value="design">设计器</TabsTrigger>
            <TabsTrigger value="monitor">监控</TabsTrigger>
            <TabsTrigger value="quality">数据质量</TabsTrigger>
            <TabsTrigger value="settings">系统设置</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-1" />
              保存
            </Button>
            <Button size="sm">
              <Play className="h-4 w-4 mr-1" />
              运行
            </Button>
          </div>
        </header>

        {/* Main content area */}
        <div className="flex-1 flex overflow-hidden">
          <TabsContent value="design" className="flex-1 h-full m-0 p-0">
            <div className="flex h-full">
              {/* Left Sidebar - Data Sources */}
              <div className="w-64 border-r border-gray-200 bg-white">
                <div className="p-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="搜索数据源..." className="pl-8" />
                  </div>
                </div>
                <ScrollArea className="h-[calc(100vh-8rem)]">
                  <div className="space-y-4 p-4">
                    <div>
                      <h3 className="mb-2 text-sm font-medium text-gray-500">关系型数据库</h3>
                      <div className="space-y-1">
                        <Button 
                          variant={selectedSource === 'mysql' ? 'secondary' : 'ghost'} 
                          className="w-full justify-start" 
                          onClick={() => setSelectedSource('mysql')}
                        >
                          <Database className="h-4 w-4 mr-2" />
                          MySQL
                        </Button>
                        <Button 
                          variant={selectedSource === 'postgresql' ? 'secondary' : 'ghost'} 
                          className="w-full justify-start"
                          onClick={() => setSelectedSource('postgresql')}
                        >
                          <Database className="h-4 w-4 mr-2" />
                          PostgreSQL
                        </Button>
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-2 text-sm font-medium text-gray-500">大数据平台</h3>
                      <div className="space-y-1">
                        <Button 
                          variant={selectedSource === 'hadoop' ? 'secondary' : 'ghost'} 
                          className="w-full justify-start"
                          onClick={() => setSelectedSource('hadoop')}
                        >
                          <HardDrive className="h-4 w-4 mr-2" />
                          Hadoop HDFS
                        </Button>
                        <Button 
                          variant={selectedSource === 'spark' ? 'secondary' : 'ghost'} 
                          className="w-full justify-start"
                          onClick={() => setSelectedSource('spark')}
                        >
                          <Server className="h-4 w-4 mr-2" />
                          Spark
                        </Button>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>

              {/* Middle Section - Data Source List */}
              <div className="flex-1 bg-gray-50">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">数据源列表</h2>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      添加连接
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {selectedSource && (
                      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Database className="h-5 w-5 mr-2 text-blue-600" />
                            <div>
                              <h3 className="font-medium">生产环境 MySQL</h3>
                              <p className="text-sm text-gray-500">mysql://prod.example.com:3306</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Section - Connection Details */}
              {selectedSource && (
                <div className="w-96 border-l border-gray-200 bg-white">
                  <div className="p-4">
                    <h2 className="text-lg font-semibold mb-4">连接配置</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">连接名称</label>
                        <Input placeholder="请输入连接名称" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">主机地址</label>
                        <Input placeholder="localhost" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">端口</label>
                        <Input placeholder="3306" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">用户名</label>
                        <Input />
                      </div>
                      <div>
                        <label className="text-sm font-medium">密码</label>
                        <Input type="password" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">数据库名</label>
                        <Input />
                      </div>
                      <Button className="w-full">
                        测试连接
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="monitor" className="flex-1 h-full m-0 p-0">
            <div className="h-full w-full p-6 bg-white">
              <h2 className="text-2xl font-bold mb-4">监控仪表盘</h2>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500">运行中任务</h3>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500">今日同步量</h3>
                  <p className="text-2xl font-bold">1.2TB</p>
                </div>
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500">平均延迟</h3>
                  <p className="text-2xl font-bold">3.5分钟</p>
                </div>
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500">告警数量</h3>
                  <p className="text-2xl font-bold text-red-500">5</p>
                </div>
              </div>
              <div className="bg-white border rounded-lg p-4 shadow-sm mb-6">
                <h3 className="text-lg font-medium mb-4">任务执行状态</h3>
                <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                  <p className="text-gray-500">任务执行状态图表</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="quality" className="flex-1 h-full m-0 p-0">
            <div className="h-full w-full p-6 bg-white">
              <h2 className="text-2xl font-bold mb-4">数据质量管理</h2>
              <div className="bg-white border rounded-lg p-4 shadow-sm mb-6">
                <h3 className="text-lg font-medium mb-4">数据质量规则</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="border rounded-lg p-3">
                    <h4 className="font-medium">完整性检查</h4>
                    <p className="text-sm text-gray-500">检查必填字段是否有空值</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <h4 className="font-medium">一致性验证</h4>
                    <p className="text-sm text-gray-500">验证源目标数据一致性</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <h4 className="font-medium">有效性检查</h4>
                    <p className="text-sm text-gray-500">检查数据是否符合业务规则</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  添加规则
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="flex-1 h-full m-0 p-0">
            <div className="h-full w-full p-6 bg-white">
              <h2 className="text-2xl font-bold mb-4">系统设置</h2>
              <div className="bg-white border rounded-lg p-4 shadow-sm mb-6">
                <h3 className="text-lg font-medium mb-4">资源配置</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">并行任务数</h4>
                    <input type="range" className="w-full" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>1</span>
                      <span>5</span>
                      <span>10</span>
                      <span>20</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">数据缓存大小</h4>
                    <input type="range" className="w-full" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>1GB</span>
                      <span>5GB</span>
                      <span>10GB</span>
                      <span>20GB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
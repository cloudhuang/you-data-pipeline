"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Database, HardDrive, Server, FileText, Globe, Search, Save, Play, Plus, ArrowRight, Settings, RefreshCw, Eye, Clock, Shield, Filter, FileJson, X } from "lucide-react"
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
  NodeProps,
  Handle,
  Position,
  MarkerType,
  Panel,
  BackgroundVariant,
  ReactFlowInstance,
} from "reactflow"
import "reactflow/dist/style.css"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet"

// 自定义节点组件
const DatabaseNode = ({ data, isConnectable }: NodeProps) => {
  return (
    <div className="bg-white border-2 rounded-md shadow-md p-3 w-52">
      <div className="flex items-center">
        <Database className="h-5 w-5 mr-2" style={{ color: data.color }} />
        <div className="font-medium truncate">{data.name}</div>
      </div>
      <div className="text-xs text-gray-500 mt-1">{data.type || "Database"}</div>
      <div className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded mt-1 flex items-center">
        <Clock className="h-3 w-3 mr-1" />
        {data.syncStrategy || "全量同步"}
      </div>
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} className="w-3 h-3 bg-blue-500" />
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} className="w-3 h-3 bg-blue-500" />
    </div>
  )
}

const BigDataNode = ({ data, isConnectable }: NodeProps) => {
  return (
    <div className="bg-white border-2 rounded-md shadow-md p-3 w-52">
      <div className="flex items-center">
        <HardDrive className="h-5 w-5 mr-2" style={{ color: data.color }} />
        <div className="font-medium truncate">{data.name}</div>
      </div>
      <div className="text-xs text-gray-500 mt-1">{data.type || "Big Data"}</div>
      <div className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded mt-1 flex items-center">
        <Clock className="h-3 w-3 mr-1" />
        {data.syncStrategy || "增量同步"}
      </div>
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} className="w-3 h-3 bg-blue-500" />
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} className="w-3 h-3 bg-blue-500" />
    </div>
  )
}

const FileNode = ({ data, isConnectable }: NodeProps) => {
  return (
    <div className="bg-white border-2 rounded-md shadow-md p-3 w-52">
      <div className="flex items-center">
        <FileText className="h-5 w-5 mr-2" style={{ color: data.color }} />
        <div className="font-medium truncate">{data.name}</div>
      </div>
      <div className="text-xs text-gray-500 mt-1">{data.type || "File System"}</div>
      <div className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded mt-1 flex items-center">
        <Clock className="h-3 w-3 mr-1" />
        {data.syncStrategy || "全量同步"}
      </div>
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} className="w-3 h-3 bg-blue-500" />
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} className="w-3 h-3 bg-blue-500" />
    </div>
  )
}

const ApiNode = ({ data, isConnectable }: NodeProps) => {
  return (
    <div className="bg-white border-2 rounded-md shadow-md p-3 w-52">
      <div className="flex items-center">
        {data.icon === "Globe" ? (
          <Globe className="h-5 w-5 mr-2" style={{ color: data.color }} />
        ) : (
          <Server className="h-5 w-5 mr-2" style={{ color: data.color }} />
        )}
        <div className="font-medium truncate">{data.name}</div>
      </div>
      <div className="text-xs text-gray-500 mt-1">{data.type || "API"}</div>
      <div className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded mt-1 flex items-center">
        <Clock className="h-3 w-3 mr-1" />
        {data.syncStrategy || "CDC实时同步"}
      </div>
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} className="w-3 h-3 bg-blue-500" />
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} className="w-3 h-3 bg-blue-500" />
    </div>
  )
}

const TransformNode = ({ data, isConnectable }: NodeProps) => {
  return (
    <div className="bg-white border-2 border-purple-500 rounded-md shadow-md p-3 w-52">
      <div className="flex items-center">
        <Filter className="h-5 w-5 mr-2 text-purple-500" />
        <div className="font-medium truncate">{data.name}</div>
      </div>
      <div className="text-xs text-gray-500 mt-1">数据转换</div>
      <div className="text-xs mt-1 truncate">{data.description || "应用数据转换规则"}</div>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} className="w-3 h-3 bg-purple-500" />
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} className="w-3 h-3 bg-purple-500" />
    </div>
  )
}

const DestinationNode = ({ data, isConnectable }: NodeProps) => {
  return (
    <div className="bg-white border-2 border-green-500 rounded-md shadow-md p-3 w-52">
      <div className="flex items-center">
        {data.id === "warehouse" ? (
          <Database className="h-5 w-5 mr-2 text-green-600" />
        ) : (
          <HardDrive className="h-5 w-5 mr-2 text-green-600" />
        )}
        <div className="font-medium truncate">{data.name}</div>
      </div>
      <div className="text-xs text-gray-500 mt-1">贴源层</div>
      <div className="text-xs mt-1 truncate">{data.description || "数据目标存储"}</div>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} className="w-3 h-3 bg-green-500" />
    </div>
  )
}

// 定义节点类型
const nodeTypes: NodeTypes = {
  jdbc: DatabaseNode,
  bigdata: BigDataNode,
  nosql: DatabaseNode,
  file: FileNode,
  api: ApiNode,
  transform: TransformNode,
  destination: DestinationNode,
}

// 初始节点和边
const initialNodes: Node[] = [
  {
    id: 'source-mysql',
    type: 'jdbc',
    position: { x: 100, y: 100 },
    data: { name: 'MySQL源系统', color: '#00758F', type: 'jdbc', syncStrategy: '全量同步' },
  },
  {
    id: 'transform-1',
    type: 'transform',
    position: { x: 350, y: 100 },
    data: { name: '数据过滤', type: 'transform', description: '过滤无效数据' },
  },
  {
    id: 'destination-1',
    type: 'destination',
    position: { x: 600, y: 100 },
    data: { id: 'warehouse', name: '数据仓库贴源层', type: 'destination', description: '原始数据存储' },
  },
]

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: 'source-mysql',
    target: 'transform-1',
    animated: true,
    style: { stroke: '#6865A5', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'e2-3',
    source: 'transform-1',
    target: 'destination-1',
    animated: true,
    style: { stroke: '#6865A5', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
]

// 连接线样式
const connectionLineStyle = { stroke: '#6865A5', strokeWidth: 2 }
const edgeOptions = {
  animated: true,
  style: { stroke: '#6865A5', strokeWidth: 2 },
  markerEnd: {
    type: MarkerType.ArrowClosed,
  },
}

// 数据源类型
const dataSources = {
  jdbc: [
    { id: "mysql", name: "MySQL", icon: Database, color: "#00758F" },
    { id: "postgresql", name: "PostgreSQL", icon: Database, color: "#336791" },
    { id: "oracle", name: "Oracle", icon: Database, color: "#F80000" },
    { id: "sqlserver", name: "SQL Server", icon: Database, color: "#CC2927" },
  ],
  bigdata: [
    { id: "hadoop", name: "Hadoop HDFS", icon: HardDrive, color: "#FF7A00" },
    { id: "spark", name: "Spark", icon: HardDrive, color: "#E25A1C" },
    { id: "hive", name: "Hive", icon: HardDrive, color: "#FDEE21" },
  ],
  nosql: [
    { id: "mongodb", name: "MongoDB", icon: Database, color: "#4DB33D" },
    { id: "redis", name: "Redis", icon: Database, color: "#D82C20" },
    { id: "elasticsearch", name: "Elasticsearch", icon: Database, color: "#FEC514" },
  ],
  file: [
    { id: "s3", name: "Amazon S3", icon: FileText, color: "#FF9900" },
    { id: "ftp", name: "FTP/SFTP", icon: FileText, color: "#0078D7" },
    { id: "hdfs", name: "HDFS", icon: FileText, color: "#FF7A00" },
  ],
  api: [
    { id: "rest", name: "REST API", icon: Globe, color: "#61DAFB" },
    { id: "graphql", name: "GraphQL", icon: Globe, color: "#E535AB" },
    { id: "kafka", name: "Kafka", icon: Server, color: "#000000" },
  ],
}

// 同步策略
const syncStrategies = [
  { id: "full", name: "全量同步", description: "完整复制源数据" },
  { id: "incremental", name: "增量同步", description: "基于时间戳或主键" },
  { id: "cdc", name: "CDC实时同步", description: "实时捕获数据变更" },
  { id: "hybrid", name: "混合模式", description: "先全量后增量" },
]

// 数据转换类型
const transformTypes = [
  { id: "filter", name: "数据过滤", description: "过滤不符合条件的数据" },
  { id: "mapping", name: "字段映射", description: "源字段到目标字段的映射" },
  { id: "aggregation", name: "数据聚合", description: "按维度聚合计算" },
  { id: "enrichment", name: "数据增强", description: "添加额外信息到数据流" },
  { id: "validation", name: "数据验证", description: "验证数据质量和完整性" },
]

interface SelectedElement {
  type: "node" | "edge"
  data: Node | Edge
}

interface DataMirrorFlowProps {
  selectedNode: any
}

export default function EnhancedETLDesigner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("design")
  const [selectedSource, setSelectedSource] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>("jdbc")
  const [searchTerm, setSearchTerm] = useState("")
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null)
  const [isConfigOpen, setIsConfigOpen] = useState(false)

  // 处理拖拽开始
  const onDragStart = useCallback((event: React.DragEvent, nodeType: string, nodeData: any) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('nodeData', JSON.stringify(nodeData));
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  // 处理拖拽结束
  const onDragEnd = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  // 处理拖拽
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      if (reactFlowInstance) {
        const type = event.dataTransfer.getData('application/reactflow')
        const nodeData = JSON.parse(event.dataTransfer.getData('nodeData'))
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        })

        const newNode = {
          id: `${type}-${nodeData.id}-${Date.now()}`,
          type,
          position,
          data: { ...nodeData, type },
        }

        setNodes((nds) => nds.concat(newNode))
        setSelectedElement({ type: 'node', data: newNode })
        setIsConfigOpen(true)
      }
    },
    [reactFlowInstance]
  )

  // 处理连接
  const onConnect = useCallback((params: Connection) => {
    const newEdge = {
      ...params,
      id: `e${params.source}-${params.target}`,
      animated: true,
      style: { stroke: '#6865A5', strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    }
    setEdges((eds) => addEdge(newEdge, eds))
    setSelectedElement({ type: 'edge', data: newEdge as Edge })
    setIsConfigOpen(true)
  }, [])
  
  // 处理节点点击
  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedElement({ type: "node", data: node })
    setIsConfigOpen(true)
  }
  
  // 处理边点击
  const onEdgeClick = (event: React.MouseEvent, edge: Edge) => {
    setSelectedElement({ type: "edge", data: edge })
    setIsConfigOpen(true)
  }

  // 添加数据源到流程图
  const addNodeToFlow = (nodeType: string, nodeData: any) => {
    if (reactFlowInstance) {
      const position = reactFlowInstance.project({
        x: 100 + Math.random() * 100,
        y: 100 + Math.random() * 100,
      })
      
      const newNode = {
        id: `${nodeType}-${nodeData.id}-${Date.now()}`,
        type: nodeType,
        position,
        data: { 
          ...nodeData, 
          type: nodeType,
          syncStrategy: nodeType === 'api' ? 'CDC实时同步' : 
                      nodeType === 'bigdata' ? '增量同步' : '全量同步'
        },
      }
      
      setNodes((nds) => nds.concat(newNode))
      setSelectedElement({ type: "node", data: newNode })
      setIsConfigOpen(true)
    }
  }

  // 添加转换节点
  const addTransformNode = (transformData: any) => {
    if (reactFlowInstance) {
      const position = reactFlowInstance.project({
        x: 300 + Math.random() * 100,
        y: 100 + Math.random() * 100,
      })
      
      const newNode = {
        id: `transform-${transformData.id}-${Date.now()}`,
        type: 'transform',
        position,
        data: { 
          name: transformData.name,
          description: transformData.description,
          type: 'transform'
        },
      }
      
      setNodes((nds) => nds.concat(newNode))
      setSelectedElement({ type: "node", data: newNode })
      setIsConfigOpen(true)
    }
  }

  // 过滤数据源
  const filteredSources = selectedCategory 
    ? dataSources[selectedCategory as keyof typeof dataSources].filter(
        (source) => source.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleSourceSelect = (source: string) => {
    setSelectedSource(source)
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* 执行按钮区浮动在画布右上角 */}
      <div style={{ position: 'absolute', top: 60, right: 24, zIndex: 20 }} className="flex items-center space-x-2">
        <Button variant="outline" size="sm">
          <Save className="h-4 w-4 mr-1" />
          保存
        </Button>
        <Button size="sm">
          <Play className="h-4 w-4 mr-1" />
          运行
        </Button>
      </div>
      {/* 主要内容区域 */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === "design" && (
          <div className="flex h-full w-full">
            {/* 左侧数据源列表 */}
            <div className="w-64 border-r border-gray-200 bg-white">
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="搜索数据源..." 
                    className="pl-8" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <ScrollArea className="h-[calc(100vh-8rem)]">
                <div className="space-y-4 p-4">
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-gray-500">数据源</h3>
                    <div className="space-y-1">
                      <Button 
                        variant={selectedSource === 'mysql' ? 'secondary' : 'ghost'} 
                        className="w-full justify-start cursor-move" 
                        draggable
                        onDragStart={(e) => onDragStart(e, 'jdbc', { 
                          id: 'mysql', 
                          name: 'MySQL',
                          description: 'MySQL 数据库连接',
                          type: 'jdbc',
                          color: '#3b82f6'
                        })}
                        onDragEnd={onDragEnd}
                      >
                        <Database className="h-4 w-4 mr-2" />
                        MySQL
                      </Button>
                      <Button 
                        variant={selectedSource === 'postgresql' ? 'secondary' : 'ghost'} 
                        className="w-full justify-start cursor-move"
                        draggable
                        onDragStart={(e) => onDragStart(e, 'jdbc', { 
                          id: 'postgresql', 
                          name: 'PostgreSQL',
                          description: 'PostgreSQL 数据库连接',
                          type: 'jdbc',
                          color: '#3b82f6'
                        })}
                        onDragEnd={onDragEnd}
                      >
                        <Database className="h-4 w-4 mr-2" />
                        PostgreSQL
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-gray-500">转换</h3>
                    <div className="space-y-1">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start cursor-move"
                        draggable
                        onDragStart={(e) => onDragStart(e, 'transform', { 
                          id: 'field-mapping', 
                          name: '字段映射',
                          description: '字段映射转换',
                          type: 'transform',
                          color: '#8b5cf6'
                        })}
                        onDragEnd={onDragEnd}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        字段映射
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start cursor-move"
                        draggable
                        onDragStart={(e) => onDragStart(e, 'transform', { 
                          id: 'json-process', 
                          name: 'JSON处理',
                          description: 'JSON数据转换',
                          type: 'transform',
                          color: '#8b5cf6'
                        })}
                        onDragEnd={onDragEnd}
                      >
                        <FileJson className="h-4 w-4 mr-2" />
                        JSON处理
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-gray-500">目标</h3>
                    <div className="space-y-1">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start cursor-move"
                        draggable
                        onDragStart={(e) => onDragStart(e, 'jdbc', { 
                          id: 'database-dest', 
                          name: '数据库',
                          description: '数据库目标',
                          type: 'jdbc',
                          color: '#10b981'
                        })}
                        onDragEnd={onDragEnd}
                      >
                        <Database className="h-4 w-4 mr-2" />
                        数据库
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start cursor-move"
                        draggable
                        onDragStart={(e) => onDragStart(e, 'api', { 
                          id: 'api-dest', 
                          name: 'API 目标',
                          description: 'API 目标连接',
                          type: 'api',
                          color: '#ec4899'
                        })}
                        onDragEnd={onDragEnd}
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        API
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>

            {/* 中间设计区域 */}
            <div className="flex-1 bg-gray-50" ref={reactFlowWrapper}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onEdgeClick={onEdgeClick}
                onInit={setReactFlowInstance}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragEnd={onDragEnd}
                nodeTypes={nodeTypes}
                fitView
                nodesDraggable={true}
                nodesConnectable={true}
                elementsSelectable={true}
                deleteKeyCode={["Delete", "Backspace"]}
                proOptions={{ hideAttribution: true }}
                defaultViewport={{ x: 0, y: 0, zoom: 0.3 }}
              >
                <Controls />
                <MiniMap />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
              </ReactFlow>
            </div>

            {/* 配置面板 */}
            <Sheet open={isConfigOpen} onOpenChange={setIsConfigOpen}>
              <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle>
                    {selectedElement?.type === "node"
                      ? `节点配置：${(selectedElement.data as Node).data?.name}`
                      : "连接配置"}
                  </SheetTitle>
                  <SheetDescription>
                    {selectedElement?.type === "node"
                      ? (selectedElement.data as Node).data?.type
                      : selectedElement?.type === "edge"
                      ? `从 ${(selectedElement.data as Edge).source} 到 ${(selectedElement.data as Edge).target}`
                      : ""}
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-4">
                  {selectedElement?.type === "node" && (
                    <>
                      <div className="space-y-2">
                        <Label>名称</Label>
                        <Input 
                          value={(selectedElement.data as Node).data?.name || ""} 
                          onChange={(e) => {
                            const updatedNodes = nodes.map(node => {
                              if (node.id === selectedElement.data.id) {
                                return {
                                  ...node,
                                  data: {
                                    ...node.data,
                                    name: e.target.value
                                  }
                                }
                              }
                              return node
                            })
                            setNodes(updatedNodes)
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>描述</Label>
                        <Textarea 
                          value={(selectedElement.data as Node).data?.description || ""} 
                          onChange={(e) => {
                            const updatedNodes = nodes.map(node => {
                              if (node.id === selectedElement.data.id) {
                                return {
                                  ...node,
                                  data: {
                                    ...node.data,
                                    description: e.target.value
                                  }
                                }
                              }
                              return node
                            })
                            setNodes(updatedNodes)
                          }}
                        />
                      </div>
                    </>
                  )}
                  
                  {selectedElement?.type === "edge" && (
                    <div className="space-y-2">
                      <Label>连接类型</Label>
                      <select 
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={(selectedElement.data as Edge).type || 'default'}
                        onChange={(e) => {
                          const updatedEdges = edges.map(edge => {
                            if (edge.id === selectedElement.data.id) {
                              return { ...edge, type: e.target.value }
                            }
                            return edge
                          })
                          setEdges(updatedEdges)
                        }}
                      >
                        <option value="default">默认连线</option>
                        <option value="step">步骤连线</option>
                        <option value="smoothstep">平滑连线</option>
                      </select>
                    </div>
                  )}
                </div>
                <SheetFooter>
                  <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
                    关闭
                  </Button>
                  <Button onClick={() => {
                    // 保存配置
                    setIsConfigOpen(false)
                  }}>
                    保存
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </div>
    </div>
  )
}
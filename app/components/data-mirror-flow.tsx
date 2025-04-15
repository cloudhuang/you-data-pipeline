"use client"

import * as React from "react"
import type { FC } from "react"
import { useCallback, useEffect, useRef, useState } from "react"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Database, FileText, Globe, HardDrive, Server, Save, Play, Settings, RefreshCw, Eye, Plus, ArrowRight, FileJson, Clock } from "lucide-react"
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerDescription, 
  DrawerFooter, 
  DrawerClose, 
  DrawerPortal, 
  DrawerOverlay 
} from "@/components/ui/drawer"

// 自定义节点组件
const DatabaseNode = ({ data, isConnectable }: NodeProps) => {
  return (
    <div className="bg-white border-2 rounded-md shadow-md p-2 w-48">
      <div className="flex items-center">
        <Database className="h-5 w-5 mr-2" style={{ color: data.color }} />
        <div className="font-medium truncate">{data.name}</div>
      </div>
      <div className="text-xs text-gray-500 mt-1">{data.type || "Database"}</div>
      <div className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded mt-1 flex items-center">
        <Clock className="h-3 w-3 mr-1" />
        {data.syncStrategy || "全量同步"}
      </div>
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
    </div>
  )
}

const BigDataNode = ({ data, isConnectable }: NodeProps) => {
  return (
    <div className="bg-white border-2 rounded-md shadow-md p-2 w-48">
      <div className="flex items-center">
        <HardDrive className="h-5 w-5 mr-2" style={{ color: data.color }} />
        <div className="font-medium truncate">{data.name}</div>
      </div>
      <div className="text-xs text-gray-500 mt-1">{data.type || "Big Data"}</div>
      <div className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded mt-1 flex items-center">
        <Clock className="h-3 w-3 mr-1" />
        {data.syncStrategy || "增量同步"}
      </div>
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
    </div>
  )
}

const FileNode = ({ data, isConnectable }: NodeProps) => {
  return (
    <div className="bg-white border-2 rounded-md shadow-md p-2 w-48">
      <div className="flex items-center">
        <FileText className="h-5 w-5 mr-2" style={{ color: data.color }} />
        <div className="font-medium truncate">{data.name}</div>
      </div>
      <div className="text-xs text-gray-500 mt-1">{data.type || "File System"}</div>
      <div className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded mt-1 flex items-center">
        <Clock className="h-3 w-3 mr-1" />
        {data.syncStrategy || "全量同步"}
      </div>
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
    </div>
  )
}

const ApiNode = ({ data, isConnectable }: NodeProps) => {
  return (
    <div className="bg-white border-2 rounded-md shadow-md p-2 w-48">
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
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
    </div>
  )
}

const TransformNode = ({ data, isConnectable }: NodeProps) => {
  return (
    <div className="bg-white border-2 border-purple-500 rounded-md shadow-md p-2 w-48">
      <div className="flex items-center">
        <div className="font-medium truncate">{data.name}</div>
      </div>
      <div className="text-xs text-gray-500 mt-1">数据转换</div>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
    </div>
  )
}

const DestinationNode = ({ data, isConnectable }: NodeProps) => {
  return (
    <div className="bg-white border-2 border-green-500 rounded-md shadow-md p-2 w-48">
      <div className="flex items-center">
        {data.id === "warehouse" ? (
          <Database className="h-5 w-5 mr-2 text-green-600" />
        ) : (
          <HardDrive className="h-5 w-5 mr-2 text-green-600" />
        )}
        <div className="font-medium truncate">{data.name}</div>
      </div>
      <div className="text-xs text-gray-500 mt-1">贴源层</div>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
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
    data: { name: '数据过滤', type: 'transform' },
  },
  {
    id: 'destination-1',
    type: 'destination',
    position: { x: 600, y: 100 },
    data: { id: 'warehouse', name: '数据仓库贴源层', type: 'destination' },
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

// 自定义边样式
const connectionLineStyle = { stroke: '#6865A5', strokeWidth: 2 }
const edgeOptions = {
  animated: true,
  style: { stroke: '#6865A5', strokeWidth: 2 },
}

interface DataMirrorFlowProps {
  selectedNode: {
    type: string;
    id: string;
    [key: string]: any;
  } | null;
}

interface SelectedElement {
  type: "node" | "edge";
  data: Node | Edge;
}

const DataMirrorFlow: FC<DataMirrorFlowProps> = ({ selectedNode }) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  
  // 处理从左侧面板选择节点的情况
  useEffect(() => {
    if (selectedNode && reactFlowInstance) {
      // 计算视口中心位置
      const { x, y, zoom } = reactFlowInstance.getViewport()
      const centerX = reactFlowWrapper.current ? (reactFlowWrapper.current.clientWidth / 2 - x) / zoom : 100
      const centerY = reactFlowWrapper.current ? (reactFlowWrapper.current.clientHeight / 2 - y) / zoom : 100
      
      const position = {
        x: centerX,
        y: centerY,
      }
      
      const newNode = {
        id: `${selectedNode.type}-${selectedNode.id}-${Date.now()}`,
        type: selectedNode.type,
        position,
        data: { 
          ...selectedNode, 
          type: selectedNode.type,
          syncStrategy: selectedNode.type === 'api' ? 'CDC实时同步' : 
                       selectedNode.type === 'bigdata' ? '增量同步' : '全量同步'
        },
      }
      
      setNodes((nds) => nds.concat(newNode))
      setSelectedElement({ type: "node", data: newNode })
      setIsDrawerOpen(true)
    }
  }, [selectedNode, reactFlowInstance, setNodes])
  
  // 处理连接
  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({
        ...params,
        animated: true,
        style: { stroke: '#6865A5', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      }, eds))
    },
    [setEdges]
  )
  
  // 处理节点点击
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedElement({ type: "node", data: node })
    setIsDrawerOpen(true)
  }, [])
  
  // 处理边点击
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    setSelectedElement({ type: "edge", data: edge })
    setIsDrawerOpen(true)
  }, [])
  
  // 处理拖拽结束
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])
  
  return (
    <div className="h-full w-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onInit={setReactFlowInstance}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        connectionLineStyle={connectionLineStyle}
        defaultEdgeOptions={edgeOptions}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        
        <Panel position="top-right" className="bg-white p-2 rounded-md shadow-md">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              预览
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-1" />
              刷新
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              配置
            </Button>
          </div>
        </Panel>
      </ReactFlow>
      
      {/* 属性配置抽屉 */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerPortal>
          <DrawerOverlay />
          <DrawerContent className="max-h-[85vh]">
            <DrawerHeader>
              <DrawerTitle>
                {selectedElement?.type === "node" ? "数据节点配置" : "连接配置"}
              </DrawerTitle>
              <DrawerDescription>
                {selectedElement?.type === "node" 
                  ? `配置${selectedElement?.data?.data?.name || ''}节点属性` 
                  : "配置数据流连接属性"}
              </DrawerDescription>
            </DrawerHeader>
            
            <div className="px-4 py-2">
              {selectedElement?.type === "node" && (
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">基本信息</TabsTrigger>
                    <TabsTrigger value="sync">同步策略</TabsTrigger>
                    <TabsTrigger value="quality">质量规则</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">名称</Label>
                      <Input 
                        id="name" 
                        value={selectedElement?.data?.data?.name || ''} 
                        onChange={(e) => {
                          // 更新节点名称
                          const updatedNodes = nodes.map(node => {
                            if (node.id === selectedElement?.data?.id) {
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
                      <Label htmlFor="description">描述</Label>
                      <Textarea 
                        id="description" 
                        placeholder="请输入节点描述信息"
                      />
                    </div>
                    
                    {(selectedElement?.data?.type === 'jdbc' || selectedElement?.data?.type === 'nosql') && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="host">主机地址</Label>
                          <Input id="host" placeholder="localhost" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="port">端口</Label>
                          <Input id="port" placeholder="3306" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="username">用户名</Label>
                          <Input id="username" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">密码</Label>
                          <Input id="password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="database">数据库名</Label>
                          <Input id="database" />
                        </div>
                        <Button variant="outline" size="sm">
                          测试连接
                        </Button>
                      </div>
                    )}
                    
                    {selectedElement?.data?.type === 'file' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="path">文件路径</Label>
                          <Input id="path" placeholder="/path/to/file" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="format">文件格式</Label>
                          <select className="w-full p-2 border rounded-md">
                            <option>CSV</option>
                            <option>JSON</option>
                            <option>Parquet</option>
                            <option>Avro</option>
                          </select>
                        </div>
                      </div>
                    )}
                    
                    {selectedElement?.data?.type === 'api' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="url">API URL</Label>
                          <Input id="url" placeholder="https://api.example.com/data" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="method">请求方法</Label>
                          <select className="w-full p-2 border rounded-md">
                            <option>GET</option>
                            <option>POST</option>
                            <option>PUT</option>
                            <option>DELETE</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="headers">请求头</Label>
                          <Textarea id="headers" placeholder="" />
                        </div>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="sync" className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label>同步策略</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div 
                          className={`border rounded-md p-3 cursor-pointer ${selectedElement?.data?.data?.syncStrategy === '全量同步' ? 'border-blue-500 bg-blue-50' : ''}`}
                          onClick={() => {
                            // 更新同步策略
                            const updatedNodes = nodes.map(node => {
                              if (node.id === selectedElement?.data?.id) {
                                return {
                                  ...node,
                                  data: {
                                    ...node.data,
                                    syncStrategy: '全量同步'
                                  }
                                }
                              }
                              return node
                            })
                            setNodes(updatedNodes)
                          }}
                        >
                          <h4 className="font-medium">全量同步</h4>
                          <p className="text-xs text-gray-500">完整复制源数据</p>
                        </div>
                        <div 
                          className={`border rounded-md p-3 cursor-pointer ${selectedElement?.data?.data?.syncStrategy === '增量同步' ? 'border-blue-500 bg-blue-50' : ''}`}
                          onClick={() => {
                            // 更新同步策略
                            const updatedNodes = nodes.map(node => {
                              if (node.id === selectedElement?.data?.id) {
                                return {
                                  ...node,
                                  data: {
                                    ...node.data,
                                    syncStrategy: '增量同步'
                                  }
                                }
                              }
                              return node
                            })
                            setNodes(updatedNodes)
                          }}
                        >
                          <h4 className="font-medium">增量同步</h4>
                          <p className="text-xs text-gray-500">基于时间戳或主键</p>
                        </div>
                        <div 
                          className={`border rounded-md p-3 cursor-pointer ${selectedElement?.data?.data?.syncStrategy === 'CDC实时同步' ? 'border-blue-500 bg-blue-50' : ''}`}
                          onClick={() => {
                            // 更新同步策略
                            const updatedNodes = nodes.map(node => {
                              if (node.id === selectedElement?.data?.id) {
                                return {
                                  ...node,
                                  data: {
                                    ...node.data,
                                    syncStrategy: 'CDC实时同步'
                                  }
                                }
                              }
                              return node
                            })
                            setNodes(updatedNodes)
                          }}
                        >
                          <h4 className="font-medium">CDC实时同步</h4>
                          <p className="text-xs text-gray-500">实时捕获数据变更</p>
                        </div>
                        <div 
                          className={`border rounded-md p-3 cursor-pointer ${selectedElement?.data?.data?.syncStrategy === '混合模式' ? 'border-blue-500 bg-blue-50' : ''}`}
                          onClick={() => {
                            // 更新同步策略
                            const updatedNodes = nodes.map(node => {
                              if (node.id === selectedElement?.data?.id) {
                                return {
                                  ...node,
                                  data: {
                                    ...node.data,
                                    syncStrategy: '混合模式'
                                  }
                                }
                              }
                              return node
                            })
                            setNodes(updatedNodes)
                          }}
                        >
                          <h4 className="font-medium">混合模式</h4>
                          <p className="text-xs text-gray-500">先全量后增量</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="schedule">调度策略</Label>
                      <select className="w-full p-2 border rounded-md">
                        <option>每小时</option>
                        <option>每天</option>
                        <option>每周</option>
                        <option>自定义</option>
                      </select>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="quality" className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label>数据质量规则</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="rule1" />
                          <Label htmlFor="rule1">完整性检查 - 非空字段验证</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="rule2" />
                          <Label htmlFor="rule2">一致性验证 - 源目标数据比对</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="rule3" />
                          <Label htmlFor="rule3">有效性检查 - 数据格式验证</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="rule4" />
                          <Label htmlFor="rule4">准确性检查 - 业务规则验证</Label>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Plus className="h-4 w-4 mr-1" />
                        添加自定义规则
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
              
              {selectedElement?.type === "edge" && (
                <Tabs defaultValue="edge-settings" className="w-full">
                  <TabsList className="grid w-full grid-cols-1">
                    <TabsTrigger value="edge-settings">连接设置</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="edge-settings" className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edge-type">连接类型</Label>
                      <select className="w-full p-2 border rounded-md">
                        <option>数据流</option>
                        <option>控制流</option>
                        <option>依赖关系</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edge-priority">优先级</Label>
                      <select className="w-full p-2 border rounded-md">
                        <option>高</option>
                        <option>中</option>
                        <option>低</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edge-description">描述</Label>
                      <Textarea id="edge-description" placeholder="请输入连接描述信息" />
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </div>
            
            <DrawerFooter>
              <Button>保存配置</Button>
              <DrawerClose asChild>
                <Button variant="outline">取消</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </DrawerPortal>
      </Drawer>
    </div>
  )
}

export default DataMirrorFlow
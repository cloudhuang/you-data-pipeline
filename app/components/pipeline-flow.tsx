"use client"

import type React from "react"

import { useCallback, useEffect, useRef, useState } from "react"
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  type NodeTypes,
  type NodeProps,
  Handle,
  Position,
  MarkerType,
  Panel,
} from "reactflow"
import "reactflow/dist/style.css"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, FileText, Globe, HardDrive, Server, Save, Play, Settings, RefreshCw, Eye, Plus, ArrowRight, FileJson } from "lucide-react"

// Custom node components
const DatabaseNode = ({ data, isConnectable }: NodeProps) => {
  return (
    <div className="bg-white border-2 rounded-md shadow-md p-2 w-48">
      <div className="flex items-center">
        <Database className="h-5 w-5 mr-2" style={{ color: data.color }} />
        <div className="font-medium truncate">{data.name}</div>
      </div>
      <div className="text-xs text-gray-500 mt-1">{data.type || "Database"}</div>
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
      <div className="text-xs text-gray-500 mt-1">Transformation</div>
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
      <div className="text-xs text-gray-500 mt-1">Destination</div>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
    </div>
  )
}

// Define node types
const nodeTypes: NodeTypes = {
  jdbc: DatabaseNode,
  bigdata: BigDataNode,
  nosql: DatabaseNode,
  file: FileNode,
  api: ApiNode,
  transform: TransformNode,
  destination: DestinationNode,
}

// Initial nodes and edges
// Initial nodes and edges with a default node to ensure something is displayed
const initialNodes: Node[] = [
  {
    id: 'default-node',
    type: 'jdbc',
    position: { x: 250, y: 250 },
    data: { name: 'Example Database', color: '#00758F', type: 'jdbc' },
  },
]
const initialEdges: Edge[] = []

// 自定义边样式
const connectionLineStyle = { stroke: '#6865A5', strokeWidth: 2 }
const edgeOptions = {
  animated: true,
  style: { stroke: '#6865A5', strokeWidth: 2 },
}

interface PipelineFlowProps {
  selectedNode: any
}

export default function PipelineFlow({ selectedNode }: PipelineFlowProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)
  const [selectedElement, setSelectedElement] = useState<any>(null)
  const [undoable, setUndoable] = useState<boolean>(false)
  const [redoable, setRedoable] = useState<boolean>(false)
  
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
        data: { ...selectedNode, type: selectedNode.type },
      }
      
      setNodes((nds) => nds.concat(newNode))
      setSelectedElement({ type: "node", data: newNode })
    }
  }, [selectedNode, reactFlowInstance, setNodes])
   
  // Initialize ReactFlow with default nodes when component mounts
  useEffect(() => {
    // Add a default node if there are no nodes
    if (nodes.length === 0) {
      const newNode = {
        id: 'default-node',
        type: 'jdbc',
        position: { x: 250, y: 250 },
        data: { name: 'Example Database', color: '#00758F', type: 'jdbc' },
      };
      setNodes([newNode]);
    }
    
    // Ensure ReactFlow fits the view after initialization
    if (reactFlowInstance) {
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.2 });
      }, 100);
    }
  }, [nodes.length, reactFlowInstance, setNodes]);
  
  // 加载保存的流程图
  useEffect(() => {
    if (reactFlowInstance) {
      const savedFlow = localStorage.getItem('pipeline-flow')
      if (savedFlow) {
        try {
          const flow = JSON.parse(savedFlow)
          if (flow.nodes && flow.edges) {
            const { x = 0, y = 0, zoom = 1 } = flow.viewport || {}
            setNodes(flow.nodes || [])
            setEdges(flow.edges || [])
            reactFlowInstance.setViewport({ x, y, zoom })
          }
        } catch (error) {
          console.error('Failed to load saved pipeline:', error)
        }
      }
      
      // Ensure ReactFlow fits the view
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.2 });
      }, 100);
    }
  }, [reactFlowInstance, setNodes, setEdges])
  
  // 撤销/重做状态管理
  useEffect(() => {
    const undoRedoListener = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'z') {
        if (event.shiftKey) {
          if (redoable) reactFlowInstance.redo()
        } else {
          if (undoable) reactFlowInstance.undo()
        }
      }
    }
    
    document.addEventListener('keydown', undoRedoListener)
    return () => {
      document.removeEventListener('keydown', undoRedoListener)
    }
  }, [reactFlowInstance, undoable, redoable])
  
  // 监听撤销/重做状态变化
  useEffect(() => {
    if (reactFlowInstance) {
      // Update undo/redo state whenever nodes or edges change
      setUndoable(reactFlowInstance.canUndo?.() || false)
      setRedoable(reactFlowInstance.canRedo?.() || false)
    }
  }, [reactFlowInstance, nodes, edges])

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "smoothstep",
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
          },
          eds,
        ),
      )
    },
    [setEdges],
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect()
      const type = event.dataTransfer.getData("application/reactflow")
      const nodeDataStr = event.dataTransfer.getData("nodeData")

      if (!type || !nodeDataStr || !reactFlowBounds || !reactFlowInstance) {
        return
      }

      const nodeData = JSON.parse(nodeDataStr)
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      const newNode = {
        id: `${type}-${nodeData.id}-${Date.now()}`,
        type,
        position,
        data: { ...nodeData, type },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance, setNodes],
  )

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedElement({ type: "node", data: node })
  }, [])

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    setSelectedElement({ type: "edge", data: edge })
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedElement(null)
  }, [])

  // 自动布局功能
  const onLayout = useCallback(() => {
    if (!nodes.length) return
    
    const direction = 'LR' // 从左到右布局
    const nodeWidth = 172
    const nodeHeight = 36
    const gap = 50
    
    // 简单的分层布局算法
    const layers: { [key: string]: Node[] } = {}
    
    // 第一层：数据源节点（没有入边的节点）
    const sourceNodes = nodes.filter(node => 
      !edges.some(edge => edge.target === node.id)
    )
    layers[0] = sourceNodes
    
    // 构建其他层
    let currentLayer = 0
    while (Object.values(layers).flat().length < nodes.length) {
      currentLayer++
      const prevLayerNodeIds = layers[currentLayer - 1].map(n => n.id)
      
      // 找出所有以上一层节点为源的边的目标节点
      const nextLayerNodes = nodes.filter(node => 
        !Object.values(layers).flat().some(n => n.id === node.id) && // 还未分配层
        edges.some(edge => 
          edge.source && 
          prevLayerNodeIds.includes(edge.source) && 
          edge.target === node.id
        )
      )
      
      if (nextLayerNodes.length === 0) break // 没有更多节点可以添加了
      layers[currentLayer] = nextLayerNodes
    }
    
    // 剩余未分配的节点放到最后一层
    const remainingNodes = nodes.filter(node => 
      !Object.values(layers).flat().some(n => n.id === node.id)
    )
    if (remainingNodes.length > 0) {
      layers[currentLayer + 1] = remainingNodes
    }
    
    // 计算每层节点的位置
    const newNodes = [...nodes]
    Object.entries(layers).forEach(([layerIdx, layerNodes]) => {
      const x = parseInt(layerIdx) * (nodeWidth + gap) + 50
      
      layerNodes.forEach((node, idx) => {
        const y = idx * (nodeHeight + gap) + 50
        const nodeIndex = newNodes.findIndex(n => n.id === node.id)
        if (nodeIndex !== -1) {
          newNodes[nodeIndex] = {
            ...newNodes[nodeIndex],
            position: { x, y }
          }
        }
      })
    })
    
    setNodes(newNodes)
    
    // 适应视图
    setTimeout(() => {
      if (reactFlowInstance) {
        reactFlowInstance.fitView({ padding: 0.2 })
      }
    }, 10)
  }, [nodes, edges, reactFlowInstance, setNodes])
  
  return (
    <div className="h-full w-full flex overflow-hidden" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}>
      <div className="flex-1" ref={reactFlowWrapper} style={{ height: '100%', width: '100%', position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          deleteKeyCode={"Delete"}
          multiSelectionKeyCode={"Control"}
          selectionKeyCode={"Shift"}
          snapToGrid={true}
          snapGrid={[15, 15]}
          defaultEdgeOptions={{
            type: "smoothstep",
            animated: true,
            style: { strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
          }}
          connectionLineStyle={connectionLineStyle}
          fitView
          style={{ width: '100%', height: '100%', background: '#f8f8f8' }}
        >
          <Controls showInteractive={true} />
          <MiniMap 
            nodeStrokeColor={(n) => {
              if (n.type === 'transform') return '#6865A5';
              if (n.type === 'destination') return '#4CAF50';
              return '#ddd';
            }}
            nodeColor={(n) => {
              if (n.type === 'transform') return '#f6f7f9';
              if (n.type === 'destination') return '#e6f7e6';
              return '#fff';
            }}
            nodeBorderRadius={3}
          />
          <Background gap={12} size={1} />
          <Panel position="top-right">
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => {
                if (reactFlowInstance) {
                  const flow = reactFlowInstance.toObject();
                  localStorage.setItem('pipeline-flow', JSON.stringify(flow));
                  alert('Pipeline saved successfully!');
                }
              }}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button size="sm" onClick={() => {
                alert('Pipeline execution started!');
              }}>
                <Play className="h-4 w-4 mr-2" />
                Run Pipeline
              </Button>
            </div>
          </Panel>
          <Panel position="top-left">
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => reactFlowInstance && reactFlowInstance.undo()} disabled={!undoable}>
                Undo
              </Button>
              <Button size="sm" variant="outline" onClick={() => reactFlowInstance && reactFlowInstance.redo()} disabled={!redoable}>
                Redo
              </Button>
              <Button size="sm" variant="outline" onClick={onLayout}>
                Auto Layout
              </Button>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {selectedElement && (
        <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto">
          <Card className="border-0 rounded-none">
            <CardHeader className="pb-2">
              <CardTitle>
                {selectedElement.type === "node" ? selectedElement.data.data.name : "Connection Settings"}
              </CardTitle>
              <CardDescription>
                {selectedElement.type === "node"
                  ? `Configure ${selectedElement.data.data.name} settings`
                  : "Configure connection properties"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedElement.type === "node" && (
                <Tabs defaultValue="settings">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                    <TabsTrigger value="schema">Schema</TabsTrigger>
                  </TabsList>
                  <TabsContent value="settings" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" defaultValue={selectedElement.data.data.name} />
                    </div>

                    {selectedElement.data.type === "jdbc" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="connection-string">Connection String</Label>
                          <Input id="connection-string" placeholder="jdbc:mysql://hostname:port/database" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" />
                          </div>
                        </div>
                      </>
                    )}

                    {selectedElement.data.type === "file" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="path">File Path</Label>
                          <Input id="path" placeholder="s3://bucket/path" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="format">File Format</Label>
                          <select className="w-full p-2 border rounded-md" id="format">
                            <option>CSV</option>
                            <option>JSON</option>
                            <option>Parquet</option>
                            <option>Avro</option>
                          </select>
                        </div>
                      </>
                    )}

                    {selectedElement.data.type === "api" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="url">API URL</Label>
                          <Input id="url" placeholder="https://api.example.com/v1/data" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="method">Method</Label>
                          <select className="w-full p-2 border rounded-md" id="method">
                            <option>GET</option>
                            <option>POST</option>
                            <option>PUT</option>
                            <option>DELETE</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="auth-type">Authentication</Label>
                          <select className="w-full p-2 border rounded-md" id="auth-type">
                            <option>None</option>
                            <option>API Key</option>
                            <option>OAuth 2.0</option>
                            <option>Basic Auth</option>
                          </select>
                        </div>
                      </>
                    )}

                    {selectedElement.data.type === "transform" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="transform-type">Transformation Type</Label>
                          <select className="w-full p-2 border rounded-md" id="transform-type">
                            <option>Filter</option>
                            <option>Join</option>
                            <option>Aggregate</option>
                            <option>Map</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="expression">Expression</Label>
                          <textarea
                            id="expression"
                            className="w-full p-2 border rounded-md h-24"
                            placeholder="Enter SQL or expression"
                          ></textarea>
                        </div>
                      </>
                    )}

                    <Button className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Apply Settings
                    </Button>
                  </TabsContent>
                  <TabsContent value="schema" className="pt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>Available Fields</Label>
                          <div className="flex items-center space-x-2">
                            <input 
                              type="text" 
                              placeholder="Search fields..." 
                              className="text-xs p-1 border rounded w-32"
                            />
                            <select className="text-xs p-1 border rounded">
                              <option value="all">All Types</option>
                              <option value="string">String</option>
                              <option value="number">Number</option>
                              <option value="date">Date/Time</option>
                              <option value="boolean">Boolean</option>
                            </select>
                          </div>
                        </div>
                        <div className="border rounded-md overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-muted text-muted-foreground text-xs">
                              <tr>
                                <th className="p-2 text-left font-medium w-1/4">Field Name</th>
                                <th className="p-2 text-left font-medium w-1/4">Type</th>
                                <th className="p-2 text-left font-medium w-2/4">Description</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              <tr className="hover:bg-muted/50">
                                <td className="p-2 text-sm">id</td>
                                <td className="p-2 text-sm text-muted-foreground">INTEGER</td>
                                <td className="p-2 text-sm text-muted-foreground">Primary key</td>
                              </tr>
                              <tr className="hover:bg-muted/50">
                                <td className="p-2 text-sm">name</td>
                                <td className="p-2 text-sm text-muted-foreground">VARCHAR(255)</td>
                                <td className="p-2 text-sm text-muted-foreground">User name</td>
                              </tr>
                              <tr className="hover:bg-muted/50">
                                <td className="p-2 text-sm">email</td>
                                <td className="p-2 text-sm text-muted-foreground">VARCHAR(255)</td>
                                <td className="p-2 text-sm text-muted-foreground">Email address</td>
                              </tr>
                              <tr className="hover:bg-muted/50">
                                <td className="p-2 text-sm">created_at</td>
                                <td className="p-2 text-sm text-muted-foreground">TIMESTAMP</td>
                                <td className="p-2 text-sm text-muted-foreground">Creation timestamp</td>
                              </tr>
                              <tr className="hover:bg-muted/50">
                                <td className="p-2 text-sm">updated_at</td>
                                <td className="p-2 text-sm text-muted-foreground">TIMESTAMP</td>
                                <td className="p-2 text-sm text-muted-foreground">Last update timestamp</td>
                              </tr>
                              <tr className="hover:bg-muted/50">
                                <td className="p-2 text-sm">status</td>
                                <td className="p-2 text-sm text-muted-foreground">VARCHAR(50)</td>
                                <td className="p-2 text-sm text-muted-foreground">Account status</td>
                              </tr>
                              <tr className="hover:bg-muted/50">
                                <td className="p-2 text-sm">last_login</td>
                                <td className="p-2 text-sm text-muted-foreground">TIMESTAMP</td>
                                <td className="p-2 text-sm text-muted-foreground">Last login time</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Refresh Schema
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          Preview Data
                        </Button>
                      </div>
                      
                      <div className="space-y-2 border-t pt-3 mt-3">
                        <Label className="font-medium">Schema Settings</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="include-all-fields" className="rounded" />
                            <label htmlFor="include-all-fields" className="text-sm">Include all fields</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="infer-types" className="rounded" />
                            <label htmlFor="infer-types" className="text-sm">Auto-infer data types</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="nullable-fields" className="rounded" />
                            <label htmlFor="nullable-fields" className="text-sm">Allow nullable fields</label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 border-t pt-3">
                        <Label className="font-medium">Field Mapping</Label>
                        <div className="text-xs text-muted-foreground mb-2">Define how source fields map to destination</div>
                        <div className="border rounded-md p-2 bg-muted/30">
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span>Source Field</span>
                            <ArrowRight className="h-4 w-4" />
                            <span>Destination Field</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <select className="text-xs p-1 border rounded w-2/5">
                                <option>id</option>
                                <option>name</option>
                                <option>email</option>
                              </select>
                              <ArrowRight className="h-3 w-3" />
                              <select className="text-xs p-1 border rounded w-2/5">
                                <option>user_id</option>
                                <option>username</option>
                                <option>user_email</option>
                              </select>
                            </div>
                            <div className="flex items-center justify-between">
                              <select className="text-xs p-1 border rounded w-2/5">
                                <option>name</option>
                                <option>id</option>
                                <option>email</option>
                              </select>
                              <ArrowRight className="h-3 w-3" />
                              <select className="text-xs p-1 border rounded w-2/5">
                                <option>username</option>
                                <option>user_id</option>
                                <option>user_email</option>
                              </select>
                            </div>
                            <Button variant="ghost" size="sm" className="w-full text-xs mt-1">
                              <Plus className="h-3 w-3 mr-1" />
                              Add Mapping
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <Button className="w-full mt-2">
                        <FileJson className="h-4 w-4 mr-2" />
                        Save Schema Configuration
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              )}

              {selectedElement.type === "edge" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edge-type">Connection Type</Label>
                    <select className="w-full p-2 border rounded-md" id="edge-type">
                      <option>Data Flow</option>
                      <option>Control Flow</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edge-mode">Transfer Mode</Label>
                    <select className="w-full p-2 border rounded-md" id="edge-mode">
                      <option>Full Load</option>
                      <option>Incremental</option>
                      <option>CDC</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edge-schedule">Schedule</Label>
                    <select className="w-full p-2 border rounded-md" id="edge-schedule">
                      <option>On Demand</option>
                      <option>Hourly</option>
                      <option>Daily</option>
                      <option>Weekly</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edge-transform">Data Transformation</Label>
                    <select className="w-full p-2 border rounded-md" id="edge-transform">
                      <option>None</option>
                      <option>Basic Mapping</option>
                      <option>Advanced Transform</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edge-error">Error Handling</Label>
                    <select className="w-full p-2 border rounded-md" id="edge-error">
                      <option>Stop on Error</option>
                      <option>Skip and Continue</option>
                      <option>Retry (3 times)</option>
                    </select>
                  </div>
                  <Button className="w-full">Apply Connection Settings</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

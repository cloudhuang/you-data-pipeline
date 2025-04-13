"use client"

import type React from "react"

import { useCallback, useRef, useState } from "react"
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
import { Database, FileText, Globe, HardDrive, Server, Save, Play, Settings } from "lucide-react"

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
const initialNodes: Node[] = []
const initialEdges: Edge[] = []

interface PipelineFlowProps {
  selectedNode: any
}

export default function PipelineFlow({ selectedNode }: PipelineFlowProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)
  const [selectedElement, setSelectedElement] = useState<any>(null)

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

  return (
    <div className="h-full flex">
      <div className="flex-1 h-full" ref={reactFlowWrapper}>
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
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
          <Panel position="top-right">
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button size="sm">
                <Play className="h-4 w-4 mr-2" />
                Run Pipeline
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
                        <Label>Available Fields</Label>
                        <div className="border rounded-md p-2 max-h-60 overflow-y-auto">
                          <ul className="space-y-1">
                            <li className="text-sm p-1 hover:bg-gray-100 rounded">id (INTEGER)</li>
                            <li className="text-sm p-1 hover:bg-gray-100 rounded">name (VARCHAR)</li>
                            <li className="text-sm p-1 hover:bg-gray-100 rounded">email (VARCHAR)</li>
                            <li className="text-sm p-1 hover:bg-gray-100 rounded">created_at (TIMESTAMP)</li>
                            <li className="text-sm p-1 hover:bg-gray-100 rounded">updated_at (TIMESTAMP)</li>
                          </ul>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        Refresh Schema
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

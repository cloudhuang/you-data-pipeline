"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Database, Save, Play } from "lucide-react"

export default function Header() {
  const pathname = usePathname()

  // Determine the active tab based on the current path
  const activeTab = pathname.startsWith('/workflow') ? 'design' :
                    pathname.startsWith('/monitor') ? 'monitor' :
                    pathname.startsWith('/data-quality') ? 'quality' :
                    pathname.startsWith('/settings') ? 'settings' : 'design'; // Default to design

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center">
        <Database className="h-6 w-6 mr-2 text-blue-600" />
        <h1 className="text-xl font-bold">You Data Pipeline</h1>
        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">数据处理</span>
      </div>

     
    </header>
  )
}
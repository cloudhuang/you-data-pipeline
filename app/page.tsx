import Link from 'next/link'
import { Database } from 'lucide-react'

export default function Home() {
  return (
    <main className="h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Database className="h-12 w-12 text-blue-600 mr-2" />
          <h1 className="text-4xl font-bold">欢迎使用数据管道设计工具</h1>
        </div>
        <p className="text-lg text-gray-600 mb-8">
          使用可视化工具轻松创建和管理您的数据流程
        </p>
        <Link href="/workflow" className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition">
          进入设计器
        </Link>
      </div>
    </main>
  )
}

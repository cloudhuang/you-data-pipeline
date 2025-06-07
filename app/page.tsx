import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Database, LayoutDashboard, Workflow } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">欢迎回来!</h1>
        <p className="text-gray-600">这是您的数据管道仪表盘。</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">数据源</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">当前配置的数据源数量</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">同步任务</CardTitle>
            <Workflow className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">正在运行的同步任务</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">组织</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">当前组织数量</p>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">快捷方式</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link href="/data-sources">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Database className="h-8 w-8 text-blue-500 mb-2" />
                <CardTitle className="text-lg">管理数据源</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">查看、添加或编辑您的数据源。</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">前往数据源</Button>
              </CardFooter>
            </Card>
          </Link>
          <Link href="/workflow">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <LayoutDashboard className="h-8 w-8 text-green-500 mb-2" />
                <CardTitle className="text-lg">工作流设计器</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">创建和可视化您的数据管道。</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">打开设计器</Button>
              </CardFooter>
            </Card>
          </Link>
          <Link href="/settings">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Workflow className="h-8 w-8 text-purple-500 mb-2" />
                <CardTitle className="text-lg">任务管理</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">监控和管理您的同步任务。</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">查看任务</Button>
              </CardFooter>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}

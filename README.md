# 数据管道设计工具 (Data Pipeline Designer)

一个现代化的可视化数据管道设计工具，帮助用户轻松创建、配置和管理数据流程。

![数据管道设计工具](./public/placeholder.svg)

## 项目概述

数据管道设计工具是一个基于Web的应用程序，允许用户通过直观的拖放界面设计复杂的数据处理流程。用户可以连接各种数据源、添加转换节点，并配置数据流向目标系统，无需编写复杂的代码。

### 主要功能

- **多种数据源支持**：连接关系型数据库、NoSQL数据库、大数据平台、文件系统和API等多种数据源
- **可视化流程设计**：通过拖放方式创建和连接数据节点
- **数据转换**：支持多种数据转换操作，如过滤、聚合、连接等
- **配置管理**：为每个节点提供详细的配置选项
- **全量加载策略**：内置多种数据全量加载策略，支持大规模数据处理
- **响应式设计**：适配不同屏幕尺寸的用户界面

## 技术栈

- **前端框架**：React 19 + Next.js 15
- **类型系统**：TypeScript
- **样式**：Tailwind CSS
- **UI组件**：Radix UI + shadcn/ui
- **图表可视化**：ReactFlow
- **图标**：Lucide React

## 安装与运行

### 前提条件

- Node.js 18.0.0 或更高版本
- npm 或 pnpm 包管理器

### 安装步骤

1. 克隆仓库

```bash
git clone <repository-url>
cd you-data-pipeline
```

2. 安装依赖

```bash
pnpm install
# 或
npm install
```

3. 启动开发服务器

```bash
pnpm dev
# 或
npm run dev
```

4. 在浏览器中访问 `http://localhost:3000`

## 项目结构

```
├── app/                  # Next.js 应用目录
│   ├── components/       # 页面级组件
│   │   ├── data-pipeline-designer.tsx  # 主设计器组件
│   │   ├── data-source-sidebar.tsx     # 数据源侧边栏
│   │   └── pipeline-flow.tsx           # 流程图设计区域
│   ├── globals.css       # 全局样式
│   ├── layout.tsx        # 应用布局
│   └── page.tsx          # 主页面
├── components/           # 共享UI组件
│   ├── theme-provider.tsx # 主题提供者
│   └── ui/               # UI组件库
├── lib/                  # 工具函数和库
│   └── utils.ts          # 通用工具函数
├── public/               # 静态资源
├── full-load-strategies.js # 全量加载策略实现
└── [配置文件]            # 各种配置文件
```

## 使用指南

1. **添加数据源**：从左侧侧边栏中选择并拖拽数据源到设计区域
2. **配置数据源**：点击数据源节点，在右侧面板中配置连接参数
3. **添加转换**：从工具栏中添加转换节点
4. **连接节点**：拖拽连接线连接各个节点
5. **配置属性**：为每个节点配置必要的属性
6. **保存和运行**：保存设计并运行数据管道

## 开发指南

### 添加新的数据源类型

1. 在 `app/components/data-source-sidebar.tsx` 中添加新的数据源定义
2. 在 `app/components/pipeline-flow.tsx` 中添加对应的节点组件
3. 实现相关的配置面板和连接逻辑

### 添加新的转换类型

1. 在 `app/components/pipeline-flow.tsx` 中的转换节点部分添加新的转换类型
2. 实现转换逻辑和配置界面

## 贡献指南

欢迎贡献代码、报告问题或提出改进建议。请遵循以下步骤：

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

[MIT](LICENSE)
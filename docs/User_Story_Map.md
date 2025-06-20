# 用户故事地图 (User Story Map)

## 1. 用户故事地图概述

本文档通过用户故事地图的形式，可视化地展现了“智能数据管道平台 (YouDataPipeline)”的核心用户活动、用户任务以及支撑这些任务的具体用户故事。它旨在帮助团队理解用户如何与产品交互以达成其目标，并为产品 backlog 的梳理、优先级排序和版本规划提供依据。

**核心用户角色**: 数据工程师、数据分析师、具备一定技术背景的业务人员

## 2. 用户故事地图结构

用户故事地图通常按以下层级组织：

- **用户活动 (Activities - 横向骨干)**: 用户为实现某个较大目标而进行的一系列高层次活动。
- **用户任务 (Tasks - 纵向分支)**: 在每个活动下，用户需要完成的具体任务步骤。
- **用户故事 (Stories - 任务下的细节)**: 对每个任务的具体功能描述，通常采用 “作为 [用户类型], 我想要 [完成某事], 以便 [获得价值]” 的格式。这些故事将进一步分解为更小的开发任务。
- **版本/发布 (Releases - 横向切片)**: 将用户故事按优先级和依赖关系映射到不同的产品版本（如 MVP, V1.1, V2.0）。

## 3. 用户故事地图详解

```mermaid
graph LR
    subgraph 用户活动 (Activities)
        A1[1. 项目与环境设置]
        A2[2. 数据源管理]
        A3[3. 工作流设计与开发]
        A4[4. 工作流调度与执行]
        A5[5. 监控与告警]
        A6[6. 结果查看与分析]
        A7[7. 系统管理与维护 (管理员)]
    end

    subgraph 版本规划 (Releases)
        R_MVP[MVP]
        R_V1_1[V1.1]
        R_V1_2[V1.2]
        R_V2_0[V2.0]
    end

    %% 1. 项目与环境设置
    subgraph A1_Tasks [1. 项目与环境设置]
        direction LR
        T1_1[1.1 创建/管理项目空间]
        T1_2[1.2 配置项目级参数]
    end
    A1 --> T1_1
    A1 --> T1_2

    subgraph S1_1 [1.1 创建/管理项目空间]
        direction TD
        S1_1_1["作为用户, 我想要创建新的项目空间, 以便隔离不同业务或团队的数据管道 (P0, MVP)"]
        S1_1_2["作为用户, 我想要查看我的项目列表, 并能切换当前项目 (P0, MVP)"]
        S1_1_3["作为用户, 我想要编辑项目名称和描述 (P1, MVP)"]
        S1_1_4["作为用户, 我想要删除不再需要的项目空间 (P2, V1.1)"]
    end
    T1_1 --> S1_1_1
    T1_1 --> S1_1_2
    T1_1 --> S1_1_3
    T1_1 --> S1_1_4

    subgraph S1_2 [1.2 配置项目级参数]
        direction TD
        S1_2_1["作为用户, 我想要为项目设置默认的通知邮箱 (P1, V1.1)"]
        S1_2_2["作为用户, 我想要配置项目的资源配额 (如适用) (P2, V2.0)"]
    end
    T1_2 --> S1_2_1
    T1_2 --> S1_2_2

    %% 2. 数据源管理
    subgraph A2_Tasks [2. 数据源管理]
        direction LR
        T2_1[2.1 添加新的数据源连接]
        T2_2[2.2 管理已有的数据源连接]
        T2_3[2.3 测试数据源连通性]
    end
    A2 --> T2_1
    A2 --> T2_2
    A2 --> T2_3

    subgraph S2_1 [2.1 添加新的数据源连接]
        direction TD
        S2_1_1["作为用户, 我想要添加数据库类型的数据源 (MySQL, PostgreSQL), 并配置连接参数 (Host, Port, User, Password, DBName) (P0, MVP)"]
        S2_1_2["作为用户, 我想要添加文件系统类型的数据源 (本地文件), 并指定路径和文件格式 (CSV, JSON) (P0, MVP)"]
        S2_1_3["作为用户, 我想要添加 Web API 类型的数据源, 并配置URL、请求方法、Header、Body及认证方式 (None, API Key) (P0, V1.1)"]
        S2_1_4["作为用户, 我想要添加 FTP/SFTP 类型的数据源, 并配置连接参数 (P1, V1.2)"]
        S2_1_5["作为用户, 我想要添加消息队列类型的数据源 (Kafka, RabbitMQ), 并配置连接参数 (P1, V2.0)"]
        S2_1_6["作为用户, 我想要为数据源连接设置一个易于识别的名称和描述 (P0, MVP)"]
    end
    T2_1 --> S2_1_1; T2_1 --> S2_1_2; T2_1 --> S2_1_3; T2_1 --> S2_1_4; T2_1 --> S2_1_5; T2_1 --> S2_1_6

    subgraph S2_2 [2.2 管理已有的数据源连接]
        direction TD
        S2_2_1["作为用户, 我想要查看已配置的数据源列表, 包含类型、名称和状态 (P0, MVP)"]
        S2_2_2["作为用户, 我想要编辑已配置的数据源的连接参数 (P0, MVP)"]
        S2_2_3["作为用户, 我想要删除不再需要的数据源连接 (P0, MVP)"]
        S2_2_4["作为用户, 我想要搜索或筛选数据源列表 (P1, V1.1)"]
    end
    T2_2 --> S2_2_1; T2_2 --> S2_2_2; T2_2 --> S2_2_3; T2_2 --> S2_2_4

    subgraph S2_3 [2.3 测试数据源连通性]
        direction TD
        S2_3_1["作为用户, 我想要在保存数据源配置前测试其连通性, 以确保参数正确 (P0, MVP)"]
        S2_3_2["作为用户, 我想要在数据源列表页快速测试某个数据源的当前连通性 (P1, V1.1)"]
    end
    T2_3 --> S2_3_1; T2_3 --> S2_3_2

    %% 3. 工作流设计与开发
    subgraph A3_Tasks [3. 工作流设计与开发]
        direction LR
        T3_1[3.1 创建与管理工作流]
        T3_2[3.2 可视化编排工作流节点]
        T3_3[3.3 配置源与目标节点]
        T3_4[3.4 配置转换与处理节点]
        T3_5[3.5 配置工作流参数与变量]
        T3_6[3.6 版本控制与历史回溯 (高级)]
    end
    A3 --> T3_1; A3 --> T3_2; A3 --> T3_3; A3 --> T3_4; A3 --> T3_5; A3 --> T3_6

    subgraph S3_1 [3.1 创建与管理工作流]
        direction TD
        S3_1_1["作为用户, 我想要创建一个新的数据工作流, 并指定名称和描述 (P0, MVP)"]
        S3_1_2["作为用户, 我想要查看项目下的工作流列表, 包含状态和最后修改时间 (P0, MVP)"]
        S3_1_3["作为用户, 我想要复制一个已有的工作流作为新工作流的基础 (P1, V1.1)"]
        S3_1_4["作为用户, 我想要删除不再需要的工作流 (P0, MVP)"]
        S3_1_5["作为用户, 我想要导入/导出工作流定义 (JSON/YAML格式) (P2, V1.2)"]
    end
    T3_1 --> S3_1_1; T3_1 --> S3_1_2; T3_1 --> S3_1_3; T3_1 --> S3_1_4; T3_1 --> S3_1_5

    subgraph S3_2 [3.2 可视化编排工作流节点]
        direction TD
        S3_2_1["作为用户, 我想要从工具箱拖拽不同类型的节点 (数据源、数据目标、转换、控制流) 到画布上 (P0, MVP)"]
        S3_2_2["作为用户, 我想要连接画布上的节点, 定义数据流向和执行顺序 (P0, MVP)"]
        S3_2_3["作为用户, 我想要删除画布上的节点和连接 (P0, MVP)"]
        S3_2_4["作为用户, 我想要在画布上对齐、排列节点, 使工作流更美观 (P1, MVP)"]
        S3_2_5["作为用户, 我想要放大/缩小/平移画布, 以便查看复杂工作流 (P0, MVP)"]
        S3_2_6["作为用户, 我想要保存当前的工作流设计 (P0, MVP)"]
    end
    T3_2 --> S3_2_1; T3_2 --> S3_2_2; T3_2 --> S3_2_3; T3_2 --> S3_2_4; T3_2 --> S3_2_5; T3_2 --> S3_2_6

    subgraph S3_3 [3.3 配置源与目标节点]
        direction TD
        S3_3_1["作为用户, 我想要为数据库源节点选择已配置的数据源, 并指定表名或自定义SQL查询 (P0, MVP)"]
        S3_3_2["作为用户, 我想要为文件源节点选择已配置的数据源, 并指定文件路径/通配符和格式 (CSV, JSON) (P0, MVP)"]
        S3_3_3["作为用户, 我想要为API源节点选择已配置的数据源, 并配置具体的请求参数和分页逻辑 (P0, V1.1)"]
        S3_3_4["作为用户, 我想要为数据库目标节点选择已配置的数据源, 指定表名, 并配置写入模式 (覆盖, 追加) (P0, MVP)"]
        S3_3_5["作为用户, 我想要为文件目标节点选择已配置的数据源, 指定输出路径和文件名模式, 及文件格式 (P0, MVP)"]
        S3_3_6["作为用户, 我想要配置数据同步策略 (全量/增量) 及增量字段/条件 (P0, MVP)"]
        S3_3_7["作为用户, 我想要配置CDC源节点 (如MySQL Binlog, PostgreSQL逻辑复制) (P1, V2.0)"]
    end
    T3_3 --> S3_3_1; T3_3 --> S3_3_2; T3_3 --> S3_3_3; T3_3 --> S3_3_4; T3_3 --> S3_3_5; T3_3 --> S3_3_6; T3_3 --> S3_3_7

    subgraph S3_4 [3.4 配置转换与处理节点]
        direction TD
        S3_4_1["作为用户, 我想要使用SQL转换节点, 编写SQL对输入数据进行转换、聚合、过滤 (P0, MVP)"]
        S3_4_2["作为用户, 我想要使用Python脚本节点, 编写Python代码对数据进行自定义处理 (P0, V1.1)"]
        S3_4_3["作为用户, 我想要使用字段映射节点, 可视化地将源字段映射到目标字段, 或进行重命名、类型转换 (P1, V1.1)"]
        S3_4_4["作为用户, 我想要使用数据清洗节点, 配置规则去除重复、处理空值、格式化数据 (P1, V1.2)"]
        S3_4_5["作为用户, 我想要使用数据校验节点, 定义规则校验数据质量, 并指定校验失败的处理方式 (P2, V2.0)"]
        S3_4_6["作为用户, 我想要使用条件分支节点 (IF/ELSE), 根据条件将数据流导向不同分支 (P1, V1.2)"]
        S3_4_7["作为用户, 我想要使用循环节点 (FOR EACH), 对数据集中的每条记录或文件执行子流程 (P2, V2.0)"]
    end
    T3_4 --> S3_4_1; T3_4 --> S3_4_2; T3_4 --> S3_4_3; T3_4 --> S3_4_4; T3_4 --> S3_4_5; T3_4 --> S3_4_6; T3_4 --> S3_4_7

    subgraph S3_5 [3.5 配置工作流参数与变量]
        direction TD
        S3_5_1["作为用户, 我想要定义工作流级别的参数 (如日期、环境), 并在节点配置中引用它们 (P1, V1.2)"]
        S3_5_2["作为用户, 我想要在执行时动态传入参数值 (P1, V1.2)"]
        S3_5_3["作为用户, 我想要使用系统内置变量 (如当前时间、任务ID) (P1, V1.1)"]
    end
    T3_5 --> S3_5_1; T3_5 --> S3_5_2; T3_5 --> S3_5_3

    subgraph S3_6 [3.6 版本控制与历史回溯]
        direction TD
        S3_6_1["作为用户, 我想要查看工作流的修改历史记录 (P2, V2.0)"]
        S3_6_2["作为用户, 我想要将工作流回溯到某个历史版本 (P2, V2.0)"]
    end
    T3_6 --> S3_6_1; T3_6 --> S3_6_2

    %% 4. 工作流调度与执行
    subgraph A4_Tasks [4. 工作流调度与执行]
        direction LR
        T4_1[4.1 手动执行工作流]
        T4_2[4.2 配置定时调度]
        T4_3[4.3 管理调度任务]
        T4_4[4.4 查看执行实例]
    end
    A4 --> T4_1; A4 --> T4_2; A4 --> T4_3; A4 --> T4_4

    subgraph S4_1 [4.1 手动执行工作流]
        direction TD
        S4_1_1["作为用户, 我想要立即手动触发一个工作流的执行 (P0, MVP)"]
        S4_1_2["作为用户, 我想要在手动执行时指定本次运行的参数 (如适用) (P1, V1.2)"]
        S4_1_3["作为用户, 我想要手动停止一个正在运行的工作流实例 (P0, MVP)"]
    end
    T4_1 --> S4_1_1; T4_1 --> S4_1_2; T4_1 --> S4_1_3

    subgraph S4_2 [4.2 配置定时调度]
        direction TD
        S4_2_1["作为用户, 我想要为工作流配置定时调度策略 (如每日、每周、每月、Cron表达式) (P0, V1.1)"]
        S4_2_2["作为用户, 我想要设置调度的生效日期范围 (P1, V1.1)"]
        S4_2_3["作为用户, 我想要配置调度失败时的重试策略 (次数、间隔) (P0, MVP)"]
        S4_2_4["作为用户, 我想要配置调度任务的超时时间 (P1, V1.2)"]
    end
    T4_2 --> S4_2_1; T4_2 --> S4_2_2; T4_2 --> S4_2_3; T4_2 --> S4_2_4

    subgraph S4_3 [4.3 管理调度任务]
        direction TD
        S4_3_1["作为用户, 我想要查看已配置的调度任务列表及其状态 (启用/禁用) (P0, V1.1)"]
        S4_3_2["作为用户, 我想要启用或禁用一个调度任务 (P0, V1.1)"]
        S4_3_3["作为用户, 我想要编辑调度任务的配置 (P0, V1.1)"]
        S4_3_4["作为用户, 我想要删除一个调度任务 (P0, V1.1)"]
    end
    T4_3 --> S4_3_1; T4_3 --> S4_3_2; T4_3 --> S4_3_3; T4_3 --> S4_3_4

    subgraph S4_4 [4.4 查看执行实例]
        direction TD
        S4_4_1["作为用户, 我想要查看工作流的执行历史列表, 包含触发方式、开始/结束时间、状态 (P0, MVP)"]
        S4_4_2["作为用户, 我想要筛选和搜索执行历史 (按工作流名称、状态、时间范围) (P1, MVP)"]
        S4_4_3["作为用户, 我想要查看特定执行实例的详细信息, 包括各节点的执行状态和耗时 (P0, MVP)"]
        S4_4_4["作为用户, 我想要查看特定执行实例的日志输出 (P0, MVP)"]
        S4_4_5["作为用户, 我想要对失败的执行实例进行手动重跑 (整个工作流或从失败节点开始) (P0, MVP)"]
    end
    T4_4 --> S4_4_1; T4_4 --> S4_4_2; T4_4 --> S4_4_3; T4_4 --> S4_4_4; T4_4 --> S4_4_5

    %% 5. 监控与告警
    subgraph A5_Tasks [5. 监控与告警]
        direction LR
        T5_1[5.1 查看系统运行状态概览]
        T5_2[5.2 配置告警规则]
        T5_3[5.3 管理告警通知]
    end
    A5 --> T5_1; A5 --> T5_2; A5 --> T5_3

    subgraph S5_1 [5.1 查看系统运行状态概览]
        direction TD
        S5_1_1["作为用户, 我想要在仪表盘上看到关键指标: 成功/失败任务数、运行中任务数、数据源连接状态 (P1, V1.1)"]
        S5_1_2["作为用户, 我想要查看资源使用情况 (CPU, 内存, 磁盘) (P2, V2.0)"]
    end
    T5_1 --> S5_1_1; T5_1 --> S5_1_2

    subgraph S5_2 [5.2 配置告警规则]
        direction TD
        S5_2_1["作为用户, 我想要配置当工作流执行失败时发送告警通知 (P0, MVP)"]
        S5_2_2["作为用户, 我想要配置当任务执行超时时发送告警通知 (P1, V1.2)"]
        S5_2_3["作为用户, 我想要配置当数据源连接异常时发送告警通知 (P1, V1.2)"]
        S5_2_4["作为用户, 我想要选择告警通知方式 (邮件, Webhook) (P1, V1.1)"]
    end
    T5_2 --> S5_2_1; T5_2 --> S5_2_2; T5_2 --> S5_2_3; T5_2 --> S5_2_4

    subgraph S5_3 [5.3 管理告警通知]
        direction TD
        S5_3_1["作为用户, 我想要查看已触发的告警历史记录 (P1, V1.1)"]
        S5_3_2["作为用户, 我想要将告警标记为已处理 (P2, V1.2)"]
    end
    T5_3 --> S5_3_1; T5_3 --> S5_3_2

    %% 6. 结果查看与分析 (轻量级)
    subgraph A6_Tasks [6. 结果查看与分析]
        direction LR
        T6_1[6.1 预览目标数据样本]
        T6_2[6.2 查看数据同步统计]
    end
    A6 --> T6_1; A6 --> T6_2

    subgraph S6_1 [6.1 预览目标数据样本]
        direction TD
        S6_1_1["作为用户, 我想要在工作流执行成功后, 快速预览目标数据源中的少量样本数据, 以便验证同步结果 (P1, V1.1)"]
    end
    T6_1 --> S6_1_1

    subgraph S6_2 [6.2 查看数据同步统计]
        direction TD
        S6_2_1["作为用户, 我想要查看任务执行后读取的记录数和写入的记录数 (P0, MVP)"]
    end
    T6_2 --> S6_2_1

    %% 7. 系统管理与维护 (管理员)
    subgraph A7_Tasks [7. 系统管理与维护 (管理员)]
        direction LR
        T7_1[7.1 用户管理]
        T7_2[7.2 权限管理]
        T7_3[7.3 系统配置]
        T7_4[7.4 查看审计日志]
    end
    A7 --> T7_1; A7 --> T7_2; A7 --> T7_3; A7 --> T7_4

    subgraph S7_1 [7.1 用户管理]
        direction TD
        S7_1_1["作为管理员, 我想要管理平台用户账户 (创建、查看、禁用、删除) (P1, V1.2)"]
    end
    T7_1 --> S7_1_1

    subgraph S7_2 [7.2 权限管理]
        direction TD
        S7_2_1["作为管理员, 我想要配置基于角色的访问控制 (RBAC), 定义角色并为用户分配角色 (P2, V2.0)"]
        S7_2_2["作为管理员, 我想要控制用户对项目、数据源、工作流的访问权限 (P2, V2.0)"]
    end
    T7_2 --> S7_2_1; T7_2 --> S7_2_2

    subgraph S7_3 [7.3 系统配置]
        direction TD
        S7_3_1["作为管理员, 我想要配置系统级参数, 如SMTP服务器、默认资源限制等 (P2, V2.0)"]
    end
    T7_3 --> S7_3_1

    subgraph S7_4 [7.4 查看审计日志]
        direction TD
        S7_4_1["作为管理员, 我想要查看关键操作的审计日志 (如登录、重要配置修改、删除操作) (P2, V2.0)"]
    end
    T7_4 --> S7_4_1

    %% Release Mapping (Illustrative - needs detailed mapping based on priority and dependencies)
    S1_1_1 --- R_MVP
    S2_1_1 --- R_MVP
    S2_1_2 --- R_MVP
    S2_3_1 --- R_MVP
    S3_1_1 --- R_MVP
    S3_2_1 --- R_MVP
    S3_3_1 --- R_MVP
    S3_4_1 --- R_MVP
    S4_1_1 --- R_MVP
    S4_2_3 --- R_MVP
    S4_4_1 --- R_MVP
    S5_2_1 --- R_MVP
    S6_2_1 --- R_MVP

    S2_1_3 --- R_V1_1
    S3_4_2 --- R_V1_1
    S4_2_1 --- R_V1_1
    S5_1_1 --- R_V1_1

    S2_1_4 --- R_V1_2
    S3_5_1 --- R_V1_2

    S2_1_5 --- R_V2_0
    S3_3_7 --- R_V2_0

    classDef mvp fill:#D6EAF8,stroke:#2E86C1,stroke-width:2px;
    classDef v1_1 fill:#D1F2EB,stroke:#1ABC9C,stroke-width:2px;
    classDef v1_2 fill:#FCF3CF,stroke:#F1C40F,stroke-width:2px;
    classDef v2_0 fill:#FADBD8,stroke:#E74C3C,stroke-width:2px;

    class S1_1_1,S1_1_2,S1_1_3,S2_1_1,S2_1_2,S2_1_6,S2_2_1,S2_2_2,S2_2_3,S2_3_1,S3_1_1,S3_1_2,S3_1_4,S3_2_1,S3_2_2,S3_2_3,S3_2_4,S3_2_5,S3_2_6,S3_3_1,S3_3_2,S3_3_4,S3_3_5,S3_3_6,S3_4_1,S4_1_1,S4_1_3,S4_2_3,S4_4_1,S4_4_2,S4_4_3,S4_4_4,S4_4_5,S5_2_1,S6_2_1 mvp;
    class S1_1_4,S1_2_1,S2_1_3,S2_2_4,S2_3_2,S3_1_3,S3_4_2,S3_4_3,S3_5_3,S4_2_1,S4_2_2,S4_3_1,S4_3_2,S4_3_3,S4_3_4,S5_1_1,S5_2_4,S5_3_1,S6_1_1 v1_1;
    class S2_1_4,S3_1_5,S3_4_4,S3_4_6,S3_5_1,S3_5_2,S4_2_4,S5_2_2,S5_2_3,S5_3_2,S7_1_1 v1_2;
    class S1_2_2,S2_1_5,S3_3_7,S3_4_5,S3_4_7,S3_6_1,S3_6_2,S5_1_2,S7_2_1,S7_2_2,S7_3_1,S7_4_1 v2_0;

```

## 4. 故事优先级与版本映射

（上图中的 `(Px, Version)` 标注了每个故事的初步优先级和计划版本，例如 `(P0, MVP)` 表示最高优先级，计划在MVP版本实现。）

- **P0 (Must Have)**: 产品核心功能，MVP版本必须包含，否则产品无法满足基本用户需求。
- **P1 (Should Have)**: 重要功能，能显著提升用户体验或产品价值，应在早期版本中尽快实现。
- **P2 (Could Have)**: 期望功能，能进一步完善产品，但优先级较低，可在后续版本迭代中考虑。
- **P3 (Won't Have for Now)**: 暂时不考虑或价值不明确的功能。

**版本规划关联**: (详细的版本功能列表请参考 `Roadmap.md`)

- **MVP**: 聚焦核心数据同步流程，支持基础数据源（数据库、文件），可视化编排，手动执行和简单调度，以及核心的执行监控和失败重试。
- **V1.1**: 扩展数据源支持（API），增加代码节点（Python），完善调度功能，初步的仪表盘和告警。
- **V1.2**: 进一步扩展数据源（FTP），增强转换能力，引入参数化和更灵活的告警配置。
- **V2.0**: 支持更高级的数据源（消息队列、CDC），引入工作流版本控制，用户权限管理，系统级配置和审计。

## 5. 说明

- 本用户故事地图是一个动态文档，会随着产品迭代和用户反馈不断更新和完善。
- 每个用户故事在进入开发前，会进一步细化为具体的开发任务和验收标准 (参考 PRD)。
- Mermaid图谱仅为示意，实际项目中可能会使用更专业的工具或物理白板进行协作。

---
**文档结束**
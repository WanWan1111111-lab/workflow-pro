# WorkFlow Pro - 智能工单管理平台

一个基于 React + TypeScript + Ant Design 的现代化工单管理系统。

## ✨ 特性

- 🎨 **极简商务风格** - 浅色系配色，大量留白，扁平化设计
- 📊 **数据可视化** - 4 种图表类型，多维度数据分析
- 🔐 **权限控制** - 管理员/普通用户角色分离
- 📱 **响应式设计** - 完美支持桌面端和移动端
- ⚡ **高性能** - 使用 Vite 构建，开发体验极佳
- 🎯 **TypeScript** - 完整的类型定义，代码更安全

## 🛠 技术栈

- **框架**: React 19 + TypeScript 6
- **构建工具**: Vite 8
- **UI 组件**: Ant Design 5
- **状态管理**: Zustand
- **路由**: React Router v6
- **图表**: Apache ECharts 5
- **样式**: Less
- **日期处理**: Day.js
- **代码规范**: ESLint + Prettier

## 📦 安装

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 🚀 快速开始

### 1. 登录系统

访问 `http://localhost:5173`，你会看到登录页面。

- **管理员账号**: 用户名输入 `admin`，密码任意
- **普通用户**: 用户名输入其他任意值，密码任意

### 2. 功能模块

#### 📊 数据看板
- 4 个关键指标卡片（总工单、总工时、加班率、活跃项目）
- 工时趋势折线图
- 项目工时分布柱状图
- 加班时段热力图
- 工单状态饼图

#### 📝 工单管理
- 工单列表展示
- 高级筛选（项目、状态、加班、关键词）
- 新建工单（管理员）
- 编辑工单（管理员）
- 删除工单（管理员）
- 批量删除（管理员）
- 查看详情（所有用户）
- 表格排序和分页

#### 👤 个人中心
- 个人信息展示
- 个人统计数据
- 我的工单列表
- 操作日志

## 📁 项目结构

```
workflow-pro/
├── src/
│   ├── assets/              # 静态资源
│   │   └── styles/          # 全局样式
│   ├── components/          # 公共组件
│   │   ├── Charts/          # 图表组件
│   │   ├── Layout/          # 布局组件
│   │   ├── PrivateRoute/    # 路由守卫
│   │   └── StatCard/        # 统计卡片
│   ├── pages/               # 页面组件
│   │   ├── Dashboard/       # 数据看板
│   │   ├── Login/           # 登录页
│   │   ├── Profile/         # 个人中心
│   │   └── WorkOrders/      # 工单管理
│   ├── store/               # 状态管理
│   ├── services/            # API 服务
│   ├── utils/               # 工具函数
│   ├── types/               # 类型定义
│   ├── constants/           # 常量和 Mock 数据
│   ├── hooks/               # 自定义 Hooks
│   ├── router.tsx           # 路由配置
│   └── main.tsx             # 入口文件
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🎯 核心功能

### 权限控制

系统支持两种角色：

| 功能 | 管理员 | 普通用户 |
|------|--------|----------|
| 查看数据看板 | ✅ | ✅ |
| 查看工单列表 | ✅ | ✅ |
| 查看工单详情 | ✅ | ✅ |
| 新建工单 | ✅ | ❌ |
| 编辑工单 | ✅ | ❌ |
| 删除工单 | ✅ | ❌ |
| 批量删除 | ✅ | ❌ |

### 数据持久化

- 使用 `localStorage` 存储用户信息和工单数据
- 刷新页面后数据不会丢失
- 预留了 API 接口对接方案

## 🎨 设计规范

### 色彩

- 主色调: `#1890ff` (专业蓝)
- 成功色: `#52c41a`
- 警告色: `#faad14`
- 错误色: `#f5222d`
- 背景色: `#f0f2f5`

### 间距

- xs: 8px
- sm: 12px
- md: 16px
- lg: 24px
- xl: 32px

## 📝 开发说明

### 添加新页面

1. 在 `src/pages/` 创建页面组件
2. 在 `src/router.tsx` 添加路由配置
3. 在 `src/components/Layout/Sidebar.tsx` 添加菜单项

### 添加新的状态

1. 在 `src/store/` 创建新的 store
2. 使用 Zustand 定义状态和方法
3. 在组件中通过 Hook 使用

### 自定义主题

修改 `src/assets/styles/variables.less` 中的变量即可。

## 🔧 配置说明

### Vite 配置

- 支持 Less 预处理器
- 配置了路径别名 `@` 指向 `src`
- 自定义 Ant Design 主题色

### TypeScript 配置

- 严格模式
- 支持 JSX
- 路径映射

## 📄 License

MIT

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

## 📮 联系方式

如有问题，请提交 Issue。

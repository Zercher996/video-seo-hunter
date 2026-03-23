# Video SEO Hunter - 项目规则

## 1. 项目概述

**项目名称**: Video SEO Hunter
**项目类型**: React + TypeScript 前端应用 (Vite 构建)
**核心功能**: YouTube 视频 SEO 关键词分析工具
**部署平台**: Vercel (前后端分离 - 前端静态部署 + API 代理)

### 技术栈
- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite 6
- **后端/代理**: Vercel Serverless Functions (@vercel/node)
- **代码检查**: ESLint 9 + TypeScript
- **样式方案**: CSS Modules

### 目录结构
```
├── api/youtube/          # Vercel Serverless API 代理
├── src/
│   ├── components/      # React 组件 (CSS Modules)
│   ├── hooks/            # 自定义 React Hooks
│   ├── services/        # API 服务调用
│   ├── types/           # TypeScript 类型定义
│   ├── utils/           # 工具函数
│   ├── styles/          # 全局样式
│   ├── App.tsx          # 主应用组件
│   └── main.tsx         # 入口文件
├── dist/                # 构建输出目录
├── .env                 # 环境变量 (包含 API Key)
└── vercel.json          # Vercel 部署配置
```

---

## 2. 开发规范

### 2.1 代码风格
- **语言**: 英文代码 (变量/函数命名)
- **注释**: 不主动添加注释（除非业务逻辑复杂）
- **格式化**: 使用 ESLint 自动格式化
- **严格模式**: TypeScript strict mode 开启

### 2.2 组件规范
- **文件命名**: PascalCase (如 `KeywordBuilder.tsx`)
- **样式文件**: 同名 `.module.css` (CSS Modules)
- **组件结构**: 组件文件 + 样式文件一对一

### 2.3 TypeScript 类型
- 所有接口放在 `src/types/index.ts`
- 使用 `interface` 而不是 `type`（除非联合类型）
- 必须导出 `Video` 和 `KeywordResult` 接口

### 2.4 状态管理
- 使用 React Hooks (`useState`, `useCallback`, `useMemo`)
- 自定义 Hooks 放在 `src/hooks/` 目录
- 两个核心 Hooks:
  - `useWordSelector`: 管理标题分词和关键词选择
  - `useYouTubeSearch`: 管理 YouTube 搜索状态和进度

---

## 3. 构建和部署

### 3.1 环境变量
- **开发环境**: 创建 `.env` 文件
  ```
  VITE_YOUTUBE_API_KEY=你的YouTube_API_Key
  ```
- **生产环境**: 在 Vercel 控制台配置 `YOUTUBE_API_KEY`

### 3.2 构建命令
| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 (localhost:5173) |
| `npm run build` | TypeScript 编译 + Vite 构建 |
| `npm run preview` | 预览生产构建 |
| `npm run lint` | ESLint 代码检查 |

### 3.3 部署流程
1. `npm run build` 生成 `dist/` 目录
2. Vercel 自动部署 `dist/` 为静态站点
3. API 函数在 `api/` 目录自动部署为 Serverless Functions
4. 配置 `vercel.json` 的 rewrites 规则将 `/api/*` 请求代理到 API 函数

---

## 4. API 设计

### 4.1 YouTube Search API 代理
**端点**: `GET /api/youtube/search`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 是 | 搜索关键词 (最长 200 字符) |

**响应格式**:
```json
{
  "videos": [
    {
      "id": "视频ID",
      "title": "视频标题",
      "thumbnail": "缩略图URL",
      "channelTitle": "频道名称",
      "viewCount": 播放量 (数字),
      "publishedAt": "发布时间 ISO 格式",
      "url": "https://www.youtube.com/watch?v=视频ID"
    }
  ]
}
```

**错误响应**:
- `400`: 缺少 keyword 或关键词过长
- `429`: YouTube API 配额用完
- `500`: 服务器内部错误

### 4.2 搜索策略
- 搜索结果数: 最多 50 条 (YouTube API 上限)
- 排序方式: `order=viewCount` (按播放量)
- 时长过滤: 2~20 分钟
- 返回数量: 过滤后取前 6 个
- 缓存策略: `Cache-Control: s-maxage=300` (5分钟)

---

## 5. 依赖管理

### 5.1 项目依赖
- **react**: ^19.0.0
- **react-dom**: ^19.0.0

### 5.2 开发依赖
- **typescript**: ~5.7.2
- **vite**: ^6.3.0
- **@vitejs/plugin-react**: ^4.3.4
- **eslint**: ^9.22.0
- **@vercel/node**: ^5.6.18

### 5.3 安装依赖
```bash
npm install
```

---

## 6. Git 规范

### 6.1 忽略文件 (.gitignore)
```
node_modules/
dist/
.env
*.local
```

### 6.2 敏感信息
- **绝不提交** `.env` 文件
- API Key 不应出现在代码中 (使用环境变量)
- `.env.example` 仅作为模板，包含占位符

---

## 7. 代码检查

### 7.1 ESLint 配置
- 使用 `eslint.config.js` (ESLint 9 flat config)
- 包含插件: react-hooks, react-refresh
- TypeScript 检查: typescript-eslint

### 7.2 TypeScript 配置
- `noUnusedLocals`: true
- `noUnusedParameters`: true
- `strict`: true
- `skipLibCheck`: true

---

## 8. 工作流程

### 8.1 开发流程
1. 创建 `.env` 文件配置 API Key
2. `npm run dev` 启动开发服务器
3. 修改代码 - 热更新自动生效
4. `npm run lint` 检查代码
5. `npm run build` 构建生产版本

### 8.2 搜索流程
1. 用户输入视频标题
2. 系统按空格拆分标题为词语气泡
3. 用户点击选择词语组合
4. 点击 "Add Keyword" 添加组合到列表
5. 点击 "Search YouTube" 逐个关键词搜索
6. 显示每个关键词的 Top 6 高播放量视频

---

## 9. 质量标准

### 9.1 代码质量
- 无 TypeScript 编译错误
- ESLint 检查通过
- 无未使用的变量或导入

### 9.2 功能要求
- 分词: `title.split(' ').filter(Boolean)`
- 关键词组合: 按选中顺序拼接，空格分隔
- 搜索: 逐个执行，支持进度显示
- 结果: 每个关键词显示最多 6 个视频卡片

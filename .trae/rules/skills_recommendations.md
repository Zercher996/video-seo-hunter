# Video SEO Hunter - 推荐 Skills 和 MCP

## 1. 推荐的 Skills

### 1.1 代码审查类 (强烈推荐)
```
npx skills add dotneet/claude-code-marketplace@typescript-react-reviewer -g -y
```
**用途**: TypeScript + React 代码审查，发现类型错误和最佳实践问题
**安装**: 3.5K installs，非常流行

### 1.2 前端性能优化类
```
npx skills add sergiodxa/agent-skills@frontend-react-best-practices -g -y
```
**用途**: React 性能优化建议，包括 hooks 使用、渲染优化
**安装**: 475 installs

### 1.3 Playwright 端到端测试
```
npx skills add jezweb/claude-skills@playwright-local -g -y
```
**用途**: E2E 测试，验证整个搜索流程
**安装**: 507 installs

### 1.4 Vercel 部署类 (强烈推荐)
```
npx skills add vercel-labs/agent-skills@deploy-to-vercel -g -y
```
**用途**: 专业的 Vercel 部署指南和问题排查
**安装**: 12.8K installs，最流行的 Vercel 部署 skill

### 1.5 TypeScript 模式类
```
npx skills add asyrafhussin/agent-skills@typescript-react-patterns -g -y
```
**用途**: TypeScript + React 常见设计模式
**安装**: 114 installs

---

## 2. 可选的 Skills

### 2.1 Playwright 测试
```
npx skills add alinaqi/claude-bootstrap@playwright-testing -g -y
```
**替代方案**: 426 installs

### 2.2 Vercel 部署
```
npx skills add sickn33/antigravity-awesome-skills@vercel-deployment -g -y
```
**替代方案**: 959 installs

---

## 3. 推荐安装顺序

### 优先级 1 (必装)
```bash
# 代码质量 - TypeScript/React 审查
npx skills add dotneet/claude-code-marketplace@typescript-react-reviewer -g -y

# 部署 - Vercel 部署
npx skills add vercel-labs/agent-skills@deploy-to-vercel -g -y
```

### 优先级 2 (建议)
```bash
# 前端性能优化
npx skills add sergiodxa/agent-skills@frontend-react-best-practices -g -y

# 端到端测试
npx skills add jezweb/claude-skills@playwright-local -g -y
```

### 优先级 3 (可选)
```bash
# TypeScript 模式
npx skills add asyrafhussin/agent-skills@typescript-react-patterns -g -y
```

---

## 4. 不推荐的 Skills

以下类型的 Skill 与本项目不太相关，不需要安装：

- **数据库相关**: 本项目无数据库
- **Docker/Kubernetes**: 本项目是纯前端静态部署
- **Python/后端框架**: 本项目使用 Vercel Serverless Functions
- **移动端开发**: 本项目是 Web 应用

---

## 5. Skills 搜索命令

如果需要查找更多 Skill，可以使用以下命令：

```bash
# React 相关
npx skills find react hooks

# TypeScript 相关
npx skills find typescript best-practices

# 部署相关
npx skills find hosting deploy

# 测试相关
npx skills find e2e testing

# 代码审查
npx skills find code review
```

---

## 6. MCP 工具

### 6.1 已有的 MCP 工具 (可用)

本项目已经包含以下 MCP 工具，无需额外安装：

| MCP 工具 | 用途 |
|----------|------|
| GitHub | 代码托管、PR 管理、Issue 跟踪 |
| Playwright | 浏览器自动化、E2E 测试 |
| Web Search | 搜索最新技术文档和解决方案 |
| Web Fetch | 获取网页内容、分析页面结构 |

### 6.2 可能有用但非必需的 MCP

**不需要安装额外的 MCP**，当前可用的工具已经足够：

- **GitHub MCP**: 用于版本控制和协作
- **Playwright MCP**: 用于 E2E 测试和 UI 验证
- **WebSearch MCP**: 用于搜索技术问题和最佳实践

---

## 7. Skill 使用建议

### 7.1 开发新功能时
使用 `typescript-react-reviewer` 检查类型安全性和最佳实践

### 7.2 部署前
使用 `deploy-to-vercel` 确保部署配置正确

### 7.3 写测试时
使用 `playwright-local` 进行端到端测试

### 7.4 性能优化时
使用 `frontend-react-best-practices` 获取优化建议

---

## 8. 查看已安装的 Skills

```bash
npx skills check
```

## 9. 更新 Skills

```bash
npx skills update
```

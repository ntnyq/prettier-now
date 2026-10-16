# 网页代码块提取：实现与验收记录

日期：2026-09-22。对应 [功能设计](./web-code-block-extraction.md)。

功能代码、自动化测试及 Chromium 主要流程已完成。Firefox 构建通过，但真实扩展运行验收受测试环境启动失败影响；本记录不代表设计中的完整发布验收矩阵已经通过。

## 已实现

- 独立 top-frame 内容脚本，发现标准 `pre/code`、普通 `pre` 和 fixture 覆盖的 Shiki、Prism、highlight.js 结构；保留原始空白、换行、实体解码结果，拒绝超限或不确定结构。
- 有界候选集合、分片扫描、增量观察、稳定节点身份及 SPA/bfcache 清理；只为可见区域创建原生按钮，使用单个 ShadowRoot 隔离样式。
- Popup 主动扫描摘要、默认不勾选、最多选择 8 项、逐项失败反馈和原始快照重试。关闭网页按钮后仍可主动扫描。
- 明确支持的语言直接创建待格式化任务；未知、不支持或冲突语言进入确认面板，提供复制原文、下载 `.txt`、选择语言及丢弃操作。
- background 串行管理 `storage.session` 队列，先暂存再开页；每个窗口复用专用工作台，支持请求幂等、部分 ACK、过期、配额限制和后台重新初始化恢复。
- 同一请求 ID 重试校验原始快照摘要；确认后删除正文，保留有时限的收据。页面发送者与工作台接收者分别校验。
- 工作台追加导入、保留草稿与已有结果、展示来源；不把网页 URL 或标题加入格式化历史。
- 自动格式化只响应编辑器用户操作。异步格式化按任务版本校验成功和失败，追加任务不会取消其他任务的格式化。
- 网页按钮总开关、按规范化 hostname 精确匹配的隐藏列表、Popup 网站开关，以及五种语言的新增文案。
- 隐私窗口拒绝新增提取功能；来源 URL 去除凭据、query 和 hash，file 来源仅保留文件名。

## 关键实现选择

1. 网页端仅使用 DOM、WXT 和校验/提取模块，不导入工作台的 Vue、Pinia、CodeMirror 或 Prettier。Chromium 提取脚本为 37,467 字节（未压缩文件大小）。
2. 样式以 `?inline` 导入并交给 `createShadowRootUi`，避免为提取按钮增加 web-accessible resources。
3. 未添加 `tabs` 权限。实际 Chromium 中 `tabs.get()` 可能不返回 URL，因此专用工作台通过精确的扩展页 sender URL、已登记 tab/window 身份和带随机 nonce 的接收端握手验证；不能把 URL 缺失直接认定为页面不可用。
4. 内容脚本设置使用独立、经过校验的存储模块，避免导入 Pinia。按钮挂载前完成设置读取。
5. 已确认导入仍沿用现有内存工作区：刷新工作台不会恢复已经 ACK 的任务。尚未确认项可在 10 分钟内重新读取；不承诺跨工作台崩溃的 exactly-once。

## 自动化验证

| 命令                         | 结果                          |
| ---------------------------- | ----------------------------- |
| `rtk pnpm run test`          | 33 个测试文件、135 项测试通过 |
| `rtk pnpm run lint`          | 通过                          |
| `rtk pnpm run typecheck`     | 通过                          |
| `rtk pnpm run build`         | Chromium MV3 构建通过         |
| `rtk pnpm run build:firefox` | Firefox MV2 构建通过          |
| `rtk git diff --check`       | 通过                          |

新增测试覆盖文本保真、语言冲突与 JSX/TSX、候选上限、动态追加和隐藏、停止观察后的主动扫描、快照重试、后台重建、ACK 失败、未知语言确认与丢弃、过期、队列满、伪造来源、Popup 部分失败、草稿保留以及格式化竞态。

使用工作区实际固定的 pnpm 12.5.1；没有修改依赖或锁文件。

Manifest 检查：Chromium 与实施前对比，`permissions`、`host_permissions`、CSP 和 `web_accessible_resources` 均未改变。Firefox 保持 `storage`、`contextMenus`、`activeTab`，资源列表仍为现有 formatter 页面和 chunks。新增提取入口只沿用 HTTP、HTTPS、file 匹配范围，且限制 top frame。

Firefox 构建另有 WXT 关于扩展 ID、数据收集声明的配置警告；本次未更改相关发布配置。

## Chromium 实际扩展验证

使用隔离的 Chrome for Testing 配置目录加载生产构建，验证了：

- 本地 fixture 的按钮挂载、隔离样式、TypeScript 单块导入和原文保留。
- 已有草稿时追加 JSON，复用专用工作台并保留原草稿。
- Bash 原文进入待确认面板，未选择语言时禁止导入；选择语言后生成任务。
- 原生 Popup 扫描 7 个摘要并选择 2 项，Popup 关闭后后台仍完成追加。
- 关闭网页按钮后移除浮层；原生 Popup 主动扫描和批量发送仍可用。
- AutoFormat 开启时，导入后等待 2 秒结果仍为空；真实键盘输入后得到格式化结果。
- Vue 官方文档和 web.dev 技术文章的代码块按钮展示，与页面 Copy 按钮共存。
- 本地动态追加 201 个代码块的单次样例，800ms 观察窗口内未记录到超过 50ms 的 Long Task。这只是样例结果，不能代表所有大文档性能。

截图：

- [工作台追加与待确认面板](../../output/playwright/code-block-import.png)
- [Vue 文档按钮](../../output/playwright/vue-document-buttons.png)
- [技术文章按钮](../../output/playwright/article-code-button.png)

## 尚未完成的发布验收

- Firefox 实际扩展运行：Playwright Firefox 启动失败，重建测试配置目录、尝试 headed/headless 和更新测试浏览器后仍出现 `Could not find profile folder`，无法据此判断功能运行结果。
- 完整的双浏览器矩阵：缩放、深浅主题、嵌套滚动、键盘全流程、设置页接收、目标标签跨窗口移动、权限关闭、file 授权、浏览器隐私窗口及手动终止后台进程恢复。
- 更多大文档与复杂高亮结构的性能采样；目前只适配经过 fixture 验证的 DOM 结构，任意源码浏览器、iframe、网页 Shadow DOM 和网页编辑器不在首版支持范围内。

发布前应按原设计第 11.2 节补齐上述浏览器验收，尤其是 Firefox，不能以构建或 happy-dom 测试代替。

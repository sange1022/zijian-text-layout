# Windows 桌面版设计

## 目标

把现有“字间”文字排版工具封装为 Windows 10/11 64 位桌面应用，保持网页版本的文字排版、字体、颜色、尺寸、署名、背景图定位和 PNG 导出功能一致，并提供可直接下载的安装版与免安装版。

## 技术方案

采用 Electron 封装现有 React/Vite 应用。桌面窗口只加载应用自身构建出的本地文件，不接入 Node.js 页面能力；启用 `contextIsolation`、关闭 `nodeIntegration` 并启用沙箱。这样可以复用现有 UI 和测试，同时把桌面层控制在一个小型主进程文件内。

未采用的方案：

- Tauri：安装包更小，但需要 Rust 工具链和更多 Windows 原生适配，当前功能收益不足以抵消复杂度。
- PWA：部署最简单，但不提供用户期待的标准 Windows `.exe` 桌面体验。

## 构建与产物

- 新增 Electron 主进程，窗口默认 1280 × 820，最小 1000 × 680。
- Vite 增加 `desktop` 构建模式，使用相对资源路径，以便通过 `file://` 加载。
- 使用 electron-builder 生成 Windows x64 两种产物：
  - NSIS 安装版 `.exe`
  - Portable 免安装版 `.exe`
- 应用名称为“字间排版工具”，版本从 `package.json` 读取。
- Windows 构建只在 GitHub Actions 的 `windows-latest` 环境执行，避免从 macOS 交叉打包造成兼容偏差。
- 构建产物上传为 Actions artifact，验证后发布到 GitHub Release，最终提供永久下载链接。

## 桌面行为

- 界面与网页版本一致，不增加桌面专用设置。
- 背景图仍由系统文件选择器选择；图片仅保留在当前应用会话。
- PNG 导出沿用现有生成逻辑并触发 Windows 下载保存行为。
- 外部链接不在应用内导航；应用本身不需要后端服务。
- 思源字体仍按现有网络字体策略加载；得意黑与汇文体继续使用已打包资源。

## 文件边界

- `electron/main.cjs`：创建和管理安全的桌面窗口。
- `vite.config.ts`：增加桌面相对路径模式。
- `package.json`：Electron 入口、构建脚本和 electron-builder 配置。
- `.github/workflows/build-windows.yml`：Windows 测试、构建和产物上传。
- 现有 `src/` 业务组件不因桌面封装而复制或分叉。

## 测试与验收

- 现有 Vitest 测试必须全部通过。
- 增加桌面构建配置测试，验证主入口、相对资源路径和 Windows 两种目标。
- 本机验证桌面模式的 Vite 构建，确保 HTML 中资源路径为相对路径。
- GitHub Windows runner 执行测试并生成两个 `.exe` 文件。
- 下载产物后核对文件名、大小和 PE 可执行文件签名头；发布 Release 并验证公开下载链接返回成功。

## 范围外

- 本次不做 macOS/Linux 安装包。
- 不做自动更新、代码签名证书、Microsoft Store 上架或后台云同步。
- 未签名安装包在部分 Windows 设备上可能出现 SmartScreen 提示，这是没有商业代码签名证书时的正常行为。

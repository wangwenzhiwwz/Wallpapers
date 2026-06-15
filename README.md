# WWZ.iM Gallery | 极致优雅的壁纸画廊 🖼️

这是一个基于 GitHub Pages 和原生前端技术打造的高级壁纸分享平台。具备 Apple 级视觉体验、全自动化的部署工作流以及极致的沉浸式交互性能。

## ✨ 核心特性 (Key Features)

* **🍏 Apple 级视觉美学：** 深度运用 Glassmorphism (毛玻璃) 材质、自适应瀑布流网格、平滑的过渡动画，并无缝支持系统级深色模式 (Dark Mode)。
* **🤖 全自动化维护 (GitHub Actions)：** 真正的“零维护”体验。只需将新壁纸放入 `images/` 目录，云端 Python 脚本将自动扫描、按时间倒序排列并重写前端渲染逻辑。
* **⚡ 极致下载体验：** 采用 Blob 流式引擎实现强制无痕下载，并在点击瞬间提供直观的文本状态与动效反馈。
* **🔗 深度链接 (Deep Linking)：** 为每一张壁纸生成专属的 URL Hash 锚点，实现高精度的单图社交分享，打开链接瞬间直达全屏。
* **📱 跨端原生交互：** 桌面端支持全屏沉浸与键盘 (`←`/`→`) 切换；移动端完美集成 Touch 手势，支持左右丝滑滑动切换。

## 📂 项目结构 (Directory Structure)

```text
/
├── .github/workflows/
│   └── auto-update.yml   # 自动化流水线配置 (GitHub Actions)
├── images/               # 🌄 核心资源目录：将你的高清壁纸存放于此
├── index.html            # 网站骨架结构
├── script.js             # 交互控制、深度链接与流式下载引擎
├── style.css             # 全局样式、动画定义与暗色模式适配
└── update_list.py        # Python 脚本：负责扫描目录并注入 JSON 数据
## 🚀 极简上新 (How to Update)

得益于强大的 CI/CD 自动化工作流，图库的日常维护被精简到了极致。您**无需触碰任何一行代码**，只需简单的拖拽，即可完成全站更新：

1. **准备资产：** 准备好您的超清壁纸文件（完美兼容 `.jpg`, `.png`, `.webp` 等主流格式）。
2. **一键上传：** 点击前往代码仓库的 [Images 目录](https://github.com/wangwenzhiwwz/Wallpapers/upload/main/images)，将图片拖入并点击 `Commit changes` 提交。
3. **静候佳音：** ☕ 喝口咖啡的功夫（约 30 秒），GitHub Actions 将在云端自动唤醒，接管包括数据抓取、时间线重构与无感部署在内的一切繁杂工作。刷新页面，您的最新杰作已完美呈现。

## 🛠 构筑基石 (Tech Stack)

本项目坚持“少即是多”的工程哲学，拒绝臃肿的框架，依托纯粹的原生技术栈榨干性能极限：

* **视觉与交互 (Frontend):** Vanilla HTML5, CSS3 (Grid Layout, Glassmorphism), ES6 JavaScript (Fetch API, Blob 流式引擎)
* **自动化中枢 (Automation):** Python 3, GitHub Actions
* **无服务器托管 (Hosting):** GitHub Pages

---
*Designed & Curated with ❤️ by [WWZ.iM](https://github.com/wangwenzhiwwz)*

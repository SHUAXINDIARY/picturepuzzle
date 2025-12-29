# 在线拼图 - 瀑布流图片拼图工具

🖼️ 一款简洁优雅的在线图片拼图工具，支持多张图片自动瀑布流布局。

## ✨ 特性

- 🔒 **隐私安全** - 图片全部在本地处理，不会上传到任何服务器
- 📐 **智能布局** - 自动瀑布流排版，适配不同尺寸图片
- 🖱️ **操作简单** - 拖拽或点击上传，一键生成拼图
- 📤 **高清导出** - 支持导出高分辨率 PNG 图片
- 💻 **PC 优化** - 针对桌面端优化的使用体验

## 🚀 在线体验

👉 [https://picturepuzzle.shuaxinjs.cn](https://picturepuzzle.shuaxinjs.cn)

## 📖 使用说明

1. 点击左上角按钮打开侧边栏
2. 点击「选择图片」上传一张或多张图片
3. 点击「生成」按钮自动布局
4. 点击「导出」按钮下载拼图结果

## 🛠️ 技术栈

| 技术 | 说明 |
| --- | --- |
| [Vite](https://vite.dev/) | 构建工具 |
| [React](https://react.dev/) | UI 框架 |
| [TypeScript](https://www.typescriptlang.org/) | 类型安全 |
| [TailwindCSS](https://tailwindcss.com/) | 样式框架 |
| [DaisyUI](https://daisyui.com/) | UI 组件库 |
| [dom-to-image](https://github.com/tsayen/dom-to-image) | DOM 截图 |
| [Cloudflare Pages](https://pages.cloudflare.com/) | 部署平台 |

## 🏗️ 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 代码格式化
pnpm format
```

## 📁 项目结构

```
src/
├── components/     # 组件
│   ├── Drawer.tsx  # 侧边栏抽屉
│   └── Modal.tsx   # 弹窗组件
├── hooks/          # 自定义 Hooks
├── utils/          # 工具函数
│   ├── index.ts    # 导出工具
│   └── tipModal.tsx # 提示弹窗
├── App.tsx         # 主应用
└── main.tsx        # 入口文件
```

## 📄 License

MIT

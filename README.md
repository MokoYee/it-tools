# IT-Tools 中文版

面向开发人员和 IT 从业者的在线工具箱。生产站点部署在 [tools.moyezi.com](https://tools.moyezi.com)。

工具数据默认在浏览器本地处理，无需后端服务。项目界面默认使用中文，同时保留其他语言切换能力。

## 本地开发

环境要求：Node.js 18.18.2、pnpm 9.11.0。

```sh
pnpm install --frozen-lockfile
pnpm dev
```

## 质量检查

```sh
pnpm lint
pnpm typecheck
pnpm test:unit -- --run
pnpm build
```

## Cloudflare Pages 部署

- 构建命令：`pnpm build`
- 输出目录：`dist`
- 生产分支：`main`
- Node.js 版本：`18.18.2`
- pnpm 版本：`9.11.0`

当前项目通过 Cloudflare Pages 的 Git 集成持续部署，推送到 `main` 后会自动触发生产构建。

## 许可证

本项目依据 [GNU GPLv3](LICENSE) 许可证发布。第三方依赖仍受各自许可证约束。

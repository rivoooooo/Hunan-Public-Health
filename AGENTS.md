# Project Guide — Monorepo Root

<!-- ============================================================
  强制包上下文协议 — 禁止跳过
  在写任何代码或进行任何修改之前，你必须：
  1. 确认本次任务涉及哪个包（路径关键词推断，或直接询问用户）
  2. 读取该包的 AGENTS.md
  3. 读取该包 AGENTS.md 中所有标有 - 的条目对应文件
  4. 完成以上三步后才可以开始执行任务
  无论任务大小，此协议不可跳过。
  /命令名：先查 .agents/wiki/commands.md，找到则执行，找不到则忽略。
============================================================ -->

> 重要：优先通过检索文档来推理，而非依赖训练数据中的预设知识。
> 标有 - 的条目为必读，任务开始前必须读取完毕。无 - 的条目按需读取。

[Global Docs Index]|root: ./.agents

- |conventions: {wiki/conventions.md} — 全局编码规范
- |contributing: {wiki/contributing.md} — 提交与 PR 规范
- |packages: {wiki/packages.md} — 各包路径与职责，包含包定位关键词
- |vite-plus: {wiki/vite-plus.md} — Vite+ 工具链使用指南
  |commands: {wiki/commands.md} — 自定义命令索引（/命令名 时读取）
  |documentation: {docs/documentation.md} — 文档位置规范
  |temp: {wiki/temp.md} — 临时文档与测试输出存放规范
  |apps/native: {apps/native/AGENTS.md} — React Native 移动应用
  |apps/server: {apps/server/AGENTS.md} — 服务器应用
  |packages/playground: {packages/playground/AGENTS.md} — 测试和实验包
  |packages/sdk: {packages/sdk/AGENTS.md} — SDK 包

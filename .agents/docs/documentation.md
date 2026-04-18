# 文档位置规范

> 此文件由 agents-docs-index skill 管理。

## 文档结构

- 项目根目录：README.md、AGENTS.md
- 各包目录：README.md、AGENTS.md
- .agents/wiki/：项目规范和指南文档
- .agents/commands/：自定义命令文档

## ADR（架构决策记录）

- 位置：docs/adr/ 目录
- 格式：YYYY-MM-DD-<title>.md
- 内容：记录重要的架构决策，包括背景、决策、后果等

## Sessions 文档

- 位置：.agents/sessions/ 目录
- 格式：YYYY-MM-DD-<session-name>.md
- 内容：记录会议讨论、决策过程和行动项

## API 文档

- 位置：各包的 docs/api/ 目录
- 格式：使用 TypeDoc 生成
- 内容：API 接口说明、参数文档、返回值说明

## 技术文档

- 位置：各包的 docs/ 目录
- 内容：技术架构、模块说明、使用指南等

## 设计文档

- 位置：DESIGN.md（项目根目录）
- 内容：设计规范、组件视觉标准、用户界面指南

## 维护文档

- 位置：.agents/wiki/ 目录下的各规范文件
- 内容：编码规范、提交规范、PR 要求等

## 临时文档

- 位置：.agents/temp/ 目录
- 内容：测试输出、临时记录等不需要提交到版本控制的文档
- 说明：此目录已加入 .gitignore，不会被提交到 git 仓库

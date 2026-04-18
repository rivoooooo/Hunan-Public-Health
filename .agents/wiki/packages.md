# 各包职责简介

> 此文件由 agents-docs-index skill 管理。

## apps/native

- 类型：React Native 移动应用
- 职责：提供跨平台的移动应用界面
- 技术栈：React Native、TypeScript、Expo
- 主要功能：用户界面、导航、数据展示

## apps/server

- 类型：服务器应用
- 职责：提供后端服务和 API
- 技术栈：TypeScript、Node.js
- 主要功能：API 端点、数据处理、业务逻辑

## packages/playground

- 类型：测试和实验包
- 职责：用于测试代码和实验新功能
- 技术栈：TypeScript
- 主要功能：测试用例、实验性代码

## packages/sdk

- 类型：SDK 包
- 职责：提供通用工具和功能
- 技术栈：TypeScript
- 主要功能：加密工具、字节处理、网络请求

## 包定位关键词参考（推断规则，非强制）

- route/React Router/页面 → apps/app
- landing/Astro/站点 → apps/web
- desktop/Wails/桌面/bridge → apps/desktop
- cli/otter → apps/cli
- REST/AI测试/文件I/O → packages/core-server
- 认证/团队/cloud → packages/cloud-server
- shadcn/@workspace/ui/共享组件 → packages/ui

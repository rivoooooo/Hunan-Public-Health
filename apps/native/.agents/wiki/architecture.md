# 包内模块结构

> 此文件由 agents-docs-index skill 管理。

## 目录结构

- app/：应用主目录
  - (tabs)/：底部标签导航
    - \_layout.tsx：标签栏布局
    - explore.tsx：探索页面
    - index.tsx：首页
  - \_layout.tsx：应用根布局
  - modal.tsx：模态框
- assets/：静态资源
  - images/：图片资源
- components/：组件
  - ui/：UI 组件
  - external-link.tsx：外部链接组件
  - haptic-tab.tsx：触觉反馈标签组件
  - hello-wave.tsx：欢迎波浪组件
  - parallax-scroll-view.tsx：视差滚动视图
  - themed-text.tsx：主题文本组件
  - themed-view.tsx：主题视图组件
- constants/：常量
  - theme.ts：主题配置
- hooks/：自定义钩子
  - use-color-scheme.ts：颜色方案钩子
  - use-color-scheme.web.ts：Web 平台颜色方案钩子
  - use-theme-color.ts：主题颜色钩子
- scripts/：脚本
  - reset-project.js：项目重置脚本

## 模块职责

- app/：应用的主要界面和导航
- assets/：存放静态资源文件
- components/：可复用的 UI 组件
- constants/：应用常量和配置
- hooks/：自定义 React 钩子
- scripts/：辅助脚本

## 技术栈

- React Native
- TypeScript
- Expo
- React Navigation

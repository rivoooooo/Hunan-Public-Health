# 包内规范

> 此文件由 agents-docs-index skill 管理。
> 以下规范覆盖根级 conventions

## 代码风格

- 遵循 React Native 最佳实践
- 使用 TypeScript 进行类型检查
- 组件文件使用 PascalCase 命名
- 非组件文件使用 camelCase 命名

## 组件规范

- 每个组件单独放在一个文件中
- 使用函数组件和 Hooks
- 组件 props 使用 TypeScript 接口定义
- 组件命名清晰，反映其功能

## 导航规范

- 使用 React Navigation v6
- 导航结构定义在 app/ 目录下
- 使用文件系统路由（Expo Router）
- 导航参数使用 TypeScript 类型定义

## 样式规范

- 使用 theme.ts 中定义的颜色和样式
- 组件样式使用 StyleSheet.create
- 避免使用内联样式
- 响应式设计，适配不同屏幕尺寸

## 性能优化

- 使用 React.memo 优化组件渲染
- 合理使用 useCallback 和 useMemo
- 避免在渲染过程中创建新对象
- 图片使用适当的尺寸和格式

## 测试规范

- 为重要组件编写单元测试
- 使用 Jest 和 React Testing Library
- 测试覆盖主要功能和边界情况

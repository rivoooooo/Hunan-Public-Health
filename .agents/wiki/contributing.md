# 提交与 PR 规范

> 此文件由 agents-docs-index skill 管理。

## 提交规范

### 格式

每次提交，Commit message 都包括三个部分：Header，Body 和 Footer。其中，Header 是必需的，Body 和 Footer 可以省略。

不管是哪一个部分，任何一行都不得超过72个字符（或100个字符）。Header 部分只有一行，包括三个字段：type（必需）、scope（可选）和 subject（必需）。Footer 部分如果提交存在一个与之关联的 Issue 则要关联。

### 主题 Subject

subject 是本次 commit 目的的简短描述，一般不要超过50个字符：

- 使用祈使句和现在时：例如使用 "change" 而不是 "changed" 或 "changes"
- 规范大小写和相应书写规则
- 无需加句号符标识结尾

### 类型 Type

类型是描述当前提交性质的枚举类型：

- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to our CI configuration files and scripts
- `docs`: 文档相关
- `feat`: 特性增加
- `fix`: 异常修复
- `perf`: 性能优化
- `refactor`: 代码重构
- `style`: 不影响代码含义的改动
- `test`: 对测试的增加或修复
- `merge`: 分支合并

### 作用域 Scope

scope 用于说明 commit 影响的范围，比如数据层、控制层、视图层等等，视项目不同而不同。

对于 monorepo：

- 如果是一个包下的提交作用域为当前的包名+影响范围
- 示例：`fix(app): 修复了xxx问题`

### 语言

提交信息使用中文。

## PR 要求

- PR 标题与提交信息保持一致
- 提供清晰的 PR 描述，说明变更的目的和影响
- 确保代码通过所有测试和 lint 检查
- 如有必要，提供相关的测试用例
- 等待代码审查后再合并

## 质量门控

- 代码必须通过类型检查（`tsc`）
- 代码必须通过 lint 检查（`eslint`）
- 代码必须通过测试（`vitest`）
- 代码必须通过构建（`build`）
- 遵循项目的代码风格规范

## 分支管理

- 主分支：main
- 特性分支：feature/xxx
- 修复分支：fix/xxx
- 发布分支：release/xxx

## 代码审查

- 审查重点：代码质量、逻辑正确性、性能、安全性
- 提供具体的审查意见和改进建议
- 尊重他人的代码，保持建设性的沟通

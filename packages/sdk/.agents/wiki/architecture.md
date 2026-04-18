# 包内模块结构

> 此文件由 agents-docs-index skill 管理。

## 目录结构

- src/：源代码目录
  - index.ts：入口文件
  - lib/：核心库目录
    - index.ts：库入口文件
    - auth/：认证模块
      - index.ts：认证功能实现
    - constants/：常量配置
      - index.ts：API URL 和请求头配置
    - crypto/：加密模块
      - byte-utils.ts：字节处理工具
      - core.ts：核心加密功能
      - hex.ts：十六进制处理工具
      - index.ts：加密模块入口
      - llmdnfff.ts：LLM 相关功能
    - request-info.ts：请求信息处理
    - utils/：工具模块
      - index.ts：工具函数，包括 fetch 封装
- package.json：包配置文件
- tsconfig.json：TypeScript 配置文件
- .gitignore：Git 忽略文件
- README.md：包说明文件
- CLAUDE.md：Claude 相关文档
- AGENTS.md：开发指南

## 模块职责

- src/index.ts：包的主入口，导出所有功能
- src/lib/index.ts：库的入口，导出库内功能
- src/lib/auth/index.ts：提供认证相关功能，包括登录和刷新 token
- src/lib/constants/index.ts：提供 API URL 和请求头配置
- src/lib/crypto/：提供加密相关功能
  - byte-utils.ts：提供字节处理相关功能
  - core.ts：提供核心加密功能
  - hex.ts：提供十六进制处理相关功能
  - index.ts：加密模块入口，导出所有加密功能
  - llmdnfff.ts：提供 LLM 相关功能
- src/lib/request-info.ts：提供请求信息处理相关功能，返回 token、cookies、cookieRaw 和 \_raw 数据
- src/lib/utils/index.ts：提供工具函数，包括 fetch 封装和 cookie 处理
- package.json：包依赖和脚本配置
- tsconfig.json：TypeScript 编译配置
- README.md：包的说明和使用指南
- CLAUDE.md：Claude 相关的文档和说明
- AGENTS.md：开发指南和文档索引

## 技术栈

- TypeScript

## 功能说明

- 提供通用工具和功能
- 认证模块：提供登录和刷新 token 功能
- 常量配置：提供 API URL 和请求头配置
- 加密模块：提供加密和解密功能
- 字节处理：提供字节操作相关功能
- 十六进制处理：提供十六进制转换和处理功能
- LLM 相关：提供与 LLM 交互的功能
- 请求信息处理：提供请求信息的处理功能，返回 token、cookies、cookieRaw 和 \_raw 数据
- 工具模块：提供工具函数，包括 fetch 封装和 cookie 处理

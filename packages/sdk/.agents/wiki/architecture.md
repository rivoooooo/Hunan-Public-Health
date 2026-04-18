# 包内模块结构

> 此文件由 agents-docs-index skill 管理。

## 目录结构

- src/：源代码目录
  - index.ts：入口文件
  - lib/：核心库目录
    - index.ts：库入口文件
    - byte-utils.ts：字节处理工具
    - crypto.ts：加密工具
    - hex.ts：十六进制处理工具
    - llmdnfff.ts：LLM 相关功能
    - request-info.ts：请求信息处理
- package.json：包配置文件
- tsconfig.json：TypeScript 配置文件
- .gitignore：Git 忽略文件
- README.md：包说明文件
- CLAUDE.md：Claude 相关文档

## 模块职责

- src/index.ts：包的主入口，导出所有功能
- src/lib/index.ts：库的入口，导出库内功能
- src/lib/byte-utils.ts：提供字节处理相关功能
- src/lib/crypto.ts：提供加密相关功能
- src/lib/hex.ts：提供十六进制处理相关功能
- src/lib/llmdnfff.ts：提供 LLM 相关功能
- src/lib/request-info.ts：提供请求信息处理相关功能
- package.json：包依赖和脚本配置
- tsconfig.json：TypeScript 编译配置
- README.md：包的说明和使用指南
- CLAUDE.md：Claude 相关的文档和说明

## 技术栈

- TypeScript

## 功能说明

- 提供通用工具和功能
- 加密工具：提供加密和解密功能
- 字节处理：提供字节操作相关功能
- 十六进制处理：提供十六进制转换和处理功能
- LLM 相关：提供与 LLM 交互的功能
- 请求信息处理：提供请求信息的处理功能

# 包内模块结构

> 此文件由 agents-docs-index skill 管理。

## 目录结构

- src/：源代码目录
  - index.ts：入口文件，包含initSDK初始化函数
  - constants/：常量配置
    - api.ts：API 端点配置
    - headers.ts：请求头配置
    - crypto.ts：加密相关常量
    - store.ts：存储键常量
    - index.ts：常量索引
  - lib/：核心库目录
    - index.ts：库入口文件
    - auth/：认证模块
      - index.ts：认证功能实现，包括prepareLogin、completeLogin、login和refreshToken
    - store/：存储模块
      - index.ts：通用存储接口实现
    - crypto/：加密模块
      - byte-utils.ts：字节处理工具
      - core.ts：核心加密功能
      - hex.ts：十六进制处理工具
      - index.ts：加密模块入口
      - llmdnfff.ts：LLM 相关功能
    - request-info.ts：请求信息处理
    - utils/：工具模块
      - cookie.ts：Cookie 处理工具
      - fetch.ts：标准fetch封装
      - index.ts：工具索引
- package.json：包配置文件
- tsconfig.json：TypeScript 配置文件
- .gitignore：Git 忽略文件
- README.md：包说明文件
- CLAUDE.md：Claude 相关文档
- AGENTS.md：开发指南

## 模块职责

- src/index.ts：包的主入口，导出所有功能，提供 initSDK 初始化函数
- src/constants/：提供常量配置
  - api.ts：提供 API 端点配置
  - headers.ts：提供请求头配置，包括 LOGIN_PAGE_HEADERS_BASE
  - crypto.ts：提供加密相关常量
  - store.ts：提供存储键常量
- src/lib/index.ts：库的入口，导出库内功能
- src/lib/auth/index.ts：提供认证相关功能，包括登录、刷新 token、prepareLogin 和 completeLogin 一站式认证
- src/lib/store/index.ts：提供通用存储接口，支持浏览器 localStorage 和 Node.js 内存存储
- src/lib/crypto/：提供加密相关功能
  - byte-utils.ts：提供字节处理相关功能
  - core.ts：提供核心加密功能
  - hex.ts：提供十六进制处理相关功能
  - index.ts：加密模块入口，导出所有加密功能
  - llmdnfff.ts：提供 LLM 相关功能
- src/lib/request-info.ts：提供请求信息处理相关功能，返回 token、cookies、cookieRaw 和 \_raw 数据
- src/lib/utils/：提供工具函数
  - cookie.ts：提供 Cookie 处理相关功能，包括 parseSetCookies、mergeCookies、cookiesToString
  - fetch.ts：提供标准 fetch 封装，包括 fetchGet、fetchPost，支持自动 Cookie 管理
- package.json：包依赖和脚本配置
- tsconfig.json：TypeScript 编译配置
- README.md：包的说明和使用指南
- CLAUDE.md：Claude 相关的文档和说明
- AGENTS.md：开发指南和文档索引

## 技术栈

- TypeScript
- ofetch

## 功能说明

- 提供通用工具和功能
- 初始化模块：提供 initSDK 函数，配置存储和 fetch
- 存储模块：提供通用 Store 接口，支持浏览器 localStorage 和 Node.js 内存存储
- 认证模块：提供登录、刷新 token、prepareLogin 和 completeLogin 一站式认证功能
- 常量配置：提供 API URL、请求头和存储键配置
- 加密模块：提供加密和解密功能
- 字节处理：提供字节操作相关功能
- 十六进制处理：提供十六进制转换和处理功能
- LLM 相关：提供与 LLM 交互的功能
- 请求信息处理：提供请求信息的处理功能，返回 token、cookies、cookieRaw 和 \_raw 数据
- 工具模块：提供工具函数，包括标准 fetch 封装和 cookie 处理，支持自动 cookie 管理

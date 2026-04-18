---
allowed-command: git
name: "Commit"
description: "git代码提交"
author: "rivoooooo"
tags: ["tools"]
version: "1.0.0"
---

## Variables

language: 中文

## Context

这是一个用于git提交的命令,你需要使用{language}语言编写提交内容并遵循以下规则:

### 格式 Format

每次提交，Commit message 都包括三个部分：Header，Body 和 Footer。其中，Header 是必需的，Body 和 Footer 可以省略。

不管是哪一个部分，任何一行都不得超过72个字符（或100个字符）。Header 部分只有一行，包括三个字段：type（必需）、scope（可选）和 subject（必需）。Footer 部分如果提交存在一个与之关联的 Issue 则要关联。

**主题 Subject**
subject 是本次 commit 目的的简短描述，一般不要超过50个字符：

使用祈使句和现在时：例如使用 "change" 而不是 "changed" 或 "changes"。
规范大小写和相应书写规则。
无需加句号符标识结尾。

### 类型 Type

类型是描述当前提交性质的枚举类型，含有以下的枚举值:

build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, np)
ci: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack,SauceLabs)
docs: 文档相关
feat: 特性增加
fix: 异常修复
perf: 性能优化
refactor: 代码重构
style: 不影响代码含义的改动 (white-space, formatting, missing semi-colons, etc)
test: 对测试的增加或修复
merge: 分支合并（格式 -> orgin_branch into target_branch ）

### 作用域 Scope [可选的]

scope 用于说明 commit 影响的范围，比如数据层、控制层、视图层等等，视项目不同而不同.

- 对于 monorepo,如果是一个包下的提交作用域为当前的包名+影响范围
  示例:
- 非 monorepo

```
fix: 修复了xx问题

修复了因为xx所导致的问题xx
```

或者

```
fix(auth): 修复了认证问题

修复了xxx导致的xxx无法认证问题xxxx
```

- monorepo

```对于 apps/app
fix(app): 修复了 xxx问题

修复了 app 的xxx问题
```

或者

```
fix(app-auth): 修复了认证问题

修复了xxx导致的xxx无法认证问题xxxx
```

### Options

你还需要遵循options中的选项,当用户没有输入options时不要提交任何内容,也不要添加任何内容到暂存区,你要询问用户要使用哪个选项:

**options**

- -s 为当前暂存区所有的的内容编写一条 commit
- -w

1.  为当前你工作所修改的内容编写一条commit,不要修改到你工作空间之外的任何内容
1.  如果当前项目是一个monorepo,那么你只能提交你当前修改的包下的内容,不能跨包提交,除非用户特别说明

- -g 为当前整个项目还未提交的内容编写一条commit
- -y 直接写入 commit

**当编写好commit后你会先输出commit信息再询问用户是否要执行命令,只有用户确认或者使用了 -y 选项才能直接提交信息**

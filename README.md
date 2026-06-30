# 微信公众号一键排版 Skill (gzh)

这是一个为 Google Antigravity (AGY) 智能助手定制的微信公众号一键排版 Skill。它可以将您输入的纯文本或 Markdown 内容快速转换成高度符合微信公众号规范、排版美观且支持深色模式的 HTML 源码。

## 特征与规范

* **极简与安全标签**：仅使用微信公众平台允许的标签（如 `<section>`, `<p>`, `<span>`, `<strong>`, `<img>` 等），彻底禁用 `<div>`, `<style>`, `<script>`, `<header>` 等非法或可能引起格式混乱的标签。
* **纯内联样式**：所有 CSS 样式严格通过内联 `style="..."` 属性注入，不包含任何外部或块级 CSS。
* **原文完整性保障**：AI 在排版过程中绝对不会增删、修改或润色用户的任何正文文字。
* **深色模式友好**：避免使用纯黑/纯白作为文字或背景色，确保多端和双色模式下的最佳阅读体验。
* **个性化偏好确认**：在排版前会自动提示确认字号、正文颜色、主题色、字间距、行间距、页面边距以及图片圆角等配置。

## 安装与配置指南

本排版工具采用通用的 Prompt 和工作流设计，支持目前主流的各种 AI 编程助手和通用大模型。

### 1. Google Antigravity (AGY)

* **项目级安装**：将 `SKILL.md` 写入到当前项目的 `.agents/skills/gzh/SKILL.md` 中。
* **全局安装**：将 `SKILL.md` 写入到全局配置 `~/.gemini/config/skills/gzh/SKILL.md` 中。
* **使用方法**：直接在对话框中输入 `/gzh` 或提及 `公众号排版` 即可自动激活。

### 2. Cursor / Windsurf / VS Code Copilot

项目根目录下已配置了 `.cursorrules` 文件。当您在 Cursor、Windsurf 等 IDE 助手里使用 Composer 或 Chat 时，AI 会自动加载并遵守这些规则。

* **使用方法**：直接在 Chat 面板中对 AI 说：“帮我排版公众号文章” 或 “/gzh”，AI 即可按照工作流开始交互。

### 3. Claude Code

Claude Code 拥有强大的 Agent 能力。您可以通过以下几种方式使用：

* **系统 Prompt 选项**：在启动 Claude Code 时，您可以使用 `claude -p "请参考项目中的 .agents/skills/gzh/SKILL.md 的工作流来处理我的排版请求"`。
* **直接加载规则**：在 Claude Code 对话中直接说：“请读取项目中的 `SKILL.md` 的排版要求，帮我排版以下内容”。

### 4. ChatGPT / Claude Web端 / 其它大模型 (如 Custom GPTs)

您可以直接将 [SKILL.md](.agents/skills/gzh/SKILL.md) 文件的全文作为 **Custom Instructions（自定义指令）** 或 **System Prompt（系统提示词）** 粘贴给任何大模型，或者在创建您的专属 **Custom GPT** 时，将此内容填入 "Instructions" 栏中，即可获得完全一致的一键排版智能体。

---

## 排版交互流程

无论使用哪款工具，标准的交互流程均分为三步：

1. **发送内容**：激活排版命令后，AI 会提示：“请发送您要排版的文章内容，支持直接粘贴文本。”
2. **确认偏好**：AI 会以简洁列表方式列出正文字号、行距、圆角等参数，您可以直接回复“默认”或按需修改其中的某几项。
3. **获取 HTML**：AI 将直接输出排版完成的 HTML 代码块。您只需一键复制，然后在微信公众号编辑器后台的【Ctrl + Alt + A】源码编辑模式中粘贴即可！

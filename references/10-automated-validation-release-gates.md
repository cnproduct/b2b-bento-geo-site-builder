# 10 - 自动化验证与发布候选门禁（Automated Validation & Release Gates）

融合 `b2b-global-brand-site-master` 的质量验收与防御性工程理念，所有网站在推向公网生产服务器之前，必须通过严格的本地自动化检查门禁。

---

## 一、 为什么需要前置门禁？

传统外贸建站往往存在四大隐蔽漏洞：
1. **死链与断裂引用**：开发阶段修改了页面名，导致导航栏或内页跳转到不存在的旧页面；
2. **私有信息泄露**：不慎将包含业务底价、真实邮箱密码、客户数据库的内部文件随同静态资源打包上传；
3. **搜索引擎元数据冲突**：多个页面使用了重复的 Title / Description，或者 Canonical 标签指向错误；
4. **结构化数据语法破损**：JSON-LD 存在语法截断或缺失必要字段，导致 Google 无法提取 Rich Snippets。

---

## 二、 自动化验证器（`scripts/validate_site.py`）执行标准

在打包上传前，必须在本地或 CI/CD 流水线中运行：
```bash
python3 scripts/validate_site.py /path/to/website --domain https://www.custombentofactory.com
```

### 1. 验证器检查矩阵
* **文件完整性**：
  * 检测所有 HTML 文件，确保至少具备 `index.html`、`robots.txt`、`sitemap.xml`；
* **HTML 元数据**：
  * 每个 HTML 页面必须有且仅有一个 `<title>`，长度建议 15–70 字符；
  * 必须有 `<meta name="description">`，且长度在 50–300 字符以内；
  * 必须有且仅有一个 `<h1>` 标签，且 `<h1>` 不得为空；
  * 必须包含正确的 `<html lang="en">` 语言声明；
* **内部链接与资源引用**：
  * 扫描全站所有 `<a href="...">`、`<img src="...">`、`<script src="...">`、`<link href="...">`；
  * 解析绝对路径与相对路径，确认所有引用目标文件均真实存在于本地磁盘；
  * 检测重复的 DOM 元素 `id`，防止 JS 控制冲突；
* **结构化数据语法**：
  * 提取所有 `<script type="application/ld+json">`，使用标准 JSON 解析器校验有效性；
  * 确保 `@context: "https://schema.org"` 语法合规；
* **私有边界隔离（Public Boundary Check）**：
  * 严格检测公开输出目录中是否混入了私有敏感文件（如 `.env`, `.git`, `private/`, `token`, `key` 等）。

---

## 三、 门禁状态与交付记录规范

依据 `b2b-global-brand-site-master` 验收准则，所有测试结果必须用确定性状态标明：
* **`PASS`**：已执行且完全符合标准；
* **`FAIL`**：已执行但未达标，附错误堆栈或缺失文件清单；
* **`NOT_RUN`**：因环境、权限或阶段限制未执行（如线上 GSC 索引需等 Google 爬虫周期，不可虚构为 PASS）；
* **`BLOCKED`**：被上游阻断（如缺少企业真实域名）。

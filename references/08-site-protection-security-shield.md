# 08 - 默认站点防护与安全隔离契约（Site Protection & Security Shield）

融合 `b2b-global-brand-site-master` (V2.2) 核心安全标准，所有由此 Skill 驱动的外贸 B2B 独立站，必须在托管层（Nginx / Cloudflare）与业务代码层强制执行默认安全防护。

---

## 一、 私有资产与敏感数据绝对隔离（Private Data Isolation）

### 1. 核心铁律
* **业务数据严禁裸露**：存储买家 RFQ 询盘记录的 `data/inquiries.json` 与 `data/inquiries.csv`、环境配置 `.env`、版本库 `.git`、内部成本核算与密钥文件，**严禁被公网匿名访客直接 HTTP GET 下载**。
* **Nginx 强制隔离规则**：
  ```nginx
  # 阻止直接访问敏感数据目录
  location ^~ /data/ {
      deny all;
      return 403;
  }

  # 阻止直接访问隐藏文件与版本库
  location ~* /\.(git|env|svn|htaccess) {
      deny all;
      return 404;
  }
  ```
* **授权访问管道**：仅允许已授权管理员通过具备密钥校验的反代 API（如 `/api/inquiries?key=...`）在受控模式下查询，阻断公网爬虫批量窃取企业客户名单与商机。

---

## 二、 基础安全响应头（HTTP Security Headers）

全站必须默认响应以下安全标头，防范点击劫持、跨站伪造与类型嗅探：

```nginx
# 防御 iframe 镜像嵌套与点击劫持 (Clickjacking)
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Content-Security-Policy "frame-ancestors 'self'" always;

# 防御 MIME 类型嗅探攻击
add_header X-Content-Type-Options "nosniff" always;

# 启用浏览器 XSS 过滤防护
add_header X-XSS-Protection "1; mode=block" always;

# 控制来源引用保护商业情报
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

---

## 三、 表单防刷与蜜罐陷阱（Honeypot & Anti-Bot Trapping）

### 1. 蜜罐隐形陷阱（Honeypot Field）
* 在所有前台 RFQ 表单中嵌入不可见的陷阱输入框：
  ```html
  <div style="display:none !important;" aria-hidden="true">
    <label for="honeypot-website">Leave this field blank</label>
    <input type="text" id="honeypot-website" name="website" tabindex="-1" autocomplete="off">
  </div>
  ```
* **判定逻辑**：正常人类买家在浏览器中看不到此字段，但恶意遍历表单的自动化垃圾爬虫会自动填充此字段。后端守护服务一旦检测到 `website` 字段非空，立即静默丢弃或返回 400，保护业务邮箱不受海量垃圾询盘干扰。

### 2. 算术验证码挑战（HMAC Math Captcha）
* 联系页与加购抽屉关键高意向出口，配置轻量级 HMAC 算术验证码（如 `7 + 8 = ?`），兼顾海外大买家填写体验与防机刷安全性。

---

## 四、 搜索引擎与 AI 爬虫分类治理

遵循 `b2b-global-brand-site-master` 官方核验指南：
1. **公开正文白名单共享**：真实人类买家与合格搜索/AI 检索爬虫（Googlebot, Bingbot, OAI-SearchBot, PerplexityBot, ClaudeBot）读取相同的语义化 HTML 与 `/llms.txt`。
2. **严禁全站验证码拦截**：不得引入 Cloudflare 5 秒全站盾或强制图片选框阻断正常搜索引擎抓取。
3. **恶意高频限流**：针对单 IP 超过 120 req/min 的高频恶意抓取，触发 HTTP 429 Too Many Requests，保障服务器带宽与服务可用性。

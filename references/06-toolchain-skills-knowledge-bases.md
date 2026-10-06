# 06 - 工具链、Skills 与底层知识库（Toolchain, Skills & Knowledge Bases）

打造 publication-grade（出版级）的外贸 B2B 独立站，需要将现代化 AI Agent 专属技能、自动化脚本、逆向协议生图工具与国际合规知识库深度协同。

---

## 一、 核心参与技能 (Skills Stack)

1. **`b2b_portal_builder`**：
   - 提供标准化的 B2B 外贸网站响应式布局骨架、产品目录网格、浮动分类药丸导航（Filter Pills）与交互组件；
   - 驱动纯原生 JavaScript 状态机，保障在零外部框架（No React/Vue build step）下达到 60fps 流畅交互。
2. **`antigravity-image-gen` (Google Imagen 3 via Connect-RPC Protocol)**：
   - 调用 Google 官方 Imagen 3 模型生成实拍级商业白底产品图与场景图；
   - 采用 1:1 比例与特定光影反射提示词，生成媲美 \$5,000 美元棚拍质量的产品渲染。
3. **`layout-typography-auditor`**：
   - 排版与中英文字体防错审计，防止单行文字换行错位、参数表格超出移动端屏幕边界、价格符号渲染乱码；
   - 保证在 iPhone、iPad、MacBook 与 4K 宽屏显示器下的完美自适应。
4. **`generative_ui`**：
   - 驱动前端交互式组件，例如爆炸图解剖标注（Hotspots）、RFQ 采购车抽屉（Quote Drawer）、潘通色彩圆点联动。

---

## 二、 关键工具链 (Toolchain)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        B2B 独立站开发与部署全流程工具链                                │
├────────────────────┬─────────────────────────────┬─────────────────────────────────────┤
│ 工具 / 协议        │ 使用命令 / 场景             │ 核心作用                            │
├────────────────────┼─────────────────────────────┼─────────────────────────────────────┤
│ 1. Google Imagen 3 │ `generate_image` (RPC)      │ 零摄影成本生成 8 款爆款 8K 高清实拍图│
│ 2. sshpass + scp   │ `sshpass -p ... scp -P 2222`│ 无人值守自动化打包同步至远程生产服务器│
│ 3. Nginx 1.18+     │ `nginx -t && reload`        │ 反向代理、CORS 开放、Clean URL 重写 │
│ 4. Cloudflare CDN  │ SSL/TLS Full Strict, Edge   │ 全球加速、DDoS 攻击防护、首屏 CDN 缓存│
│ 5. Python 3.10+    │ `verify_endpoints.py`       │ 自动化巡检 20+ 页面和图片 HTTP 状态 │
│ 6. GitHub CLI      │ `gh repo create` / `git`    │ 技能资产云端托管与跨会话复用        │
└────────────────────┴─────────────────────────────┴─────────────────────────────────────┘
```

### 1. 工业级电商摄影 Prompt（提示词模板）
以新一代可微波 304 不锈钢便当盒为例：
```text
Professional commercial e-commerce product photography of a modern next-generation microwave-safe 304 stainless steel bento box lunch box. Rounded rectangular smooth brushed stainless steel base with silicone steam release vent valve on the clear frosted lid. Premium minimalist aesthetic, soft studio lighting, soft gradient clean background, crisp reflections on metallic stainless steel surface, airtight silicone seal visible, ultra-realistic B2B catalog product shot, 8k resolution.
```

### 2. Nginx 高性能配置模版（支持 Clean URL 与 AI JSON 跨域）
```nginx
server {
    listen 80;
    server_name custombentofactory.com www.custombentofactory.com;
    return 301 https://www.custombentofactory.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.custombentofactory.com;
    root /var/www/CustomBentoFactory.com;
    index index.html;

    # Clean URL: 自动支持 /products -> /products.html
    location / {
        try_files $uri $uri/ $uri.html =404;
    }

    # 机器可读 AI 知识库允许全网 AI Bot 跨域高速抓取
    location /ai/ {
        add_header Access-Control-Allow-Origin *;
        add_header Cache-Control "public, max-age=3600";
    }

    location = /llms.txt {
        add_header Access-Control-Allow-Origin *;
        default_type text/plain;
    }

    # 静态图片超长缓存
    location ~* \.(jpg|jpeg|png|webp|svg|gif|ico)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

---

## 三、 底层标准与食品安全知识库

独立站所有文案和技术规格均基于以下国际权威标准：
1. **材料安全**：
   - `US FDA 21 CFR 177.1520` (Olefin polymers)
   - `German LFGB §30 & §31` (Lebensmittel-, Bedarfsgegenstände- und Futtermittelgesetzbuch)
   - `EU Regulation No 10/2011` (Plastic materials intended to come into contact with food)
   - `California Proposition 65` (Safe Drinking Water and Toxic Enforcement Act of 1986)
2. **机械与物理检测**：
   - `MIL-STD-810H Method 516.8` (Shock & Drop Testing)
   - `ASTM D790` (Flexural Properties of Unreinforced and Reinforced Plastics)
   - `ASTM D638` (Tensile Properties of Plastics)
3. **企业与社会合规**：
   - `Disney FAMA` (Facility and Merchandise Authorization)
   - `Coca-Cola SGP` (Supplier Guiding Principles)
   - `McDonald's SWA` (Supplier Workplace Accountability)
   - `Sedex SMETA 4-Pillar` (Labor, Health & Safety, Environment, Business Ethics)

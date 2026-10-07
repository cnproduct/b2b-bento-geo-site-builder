# 08 - B2B 出海独立站 SEO+GEO 双引擎 15 步全链路 SOP 与标准 Prompts 手册

> 本指南为 `b2b-bento-geo-site-builder` 技能与 `renwork-export-kb` 企业知识库联合调度的核心操作手册，涵盖从企业冷启动、双轨情报挖掘、标杆拆解、知识库构建、双引擎内容开发、海量发品到自动化部署验证的全流程工业级 Prompt。

---

## 1. 架构定位与多技能协同图谱

```mermaid
flowchart LR
    A["输入: 企业简介/官网/Logo"] --> B["B2B+B2C 双轨情报挖掘"]
    B --> C["SEO/GEO 顶级流量标杆拆解"]
    C --> D["renwork-export-kb 21模块知识库"]
    D --> E["产品矩阵与阶梯报价规划"]
    E --> F["海量 SKU 数据与 Imagen 3 商拍"]
    F --> G["SEO+GEO 双引擎内容与端点生成"]
    G --> H["整站动态编译与 Nginx 部署"]
    H --> I["HTTP/2 与 AI 搜索真机验证"]
```

---

## 2. 15 步全量标准 Prompt 索引表

| 序号 | 步骤名称 | 核心调用技能 / 工具 | 关键产出物 |
|---|---|---|---|
| **Step 1** | 企业冷启动资产深度提取 | `ingest-enterprise-assets` | 真实厂区、设备台数、光伏容量与资质台账 JSON |
| **Step 2** | 工厂真相与差异化基石锁定 | `brand-onboarding`, `brand-voice` | 一句话 Factory Truth、三类买家主张与宣发红线 |
| **Step 3** | B2B 海关提单与大买家周期穿透 | `customs-buyer-search-skill` | HS 编码矩阵、柜量形态、采购时序与高意图搜索词 |
| **Step 4** | C 端全网爆品雷达挖掘 | `dtc-product-intelligence` | TikTok/Amazon/Trends/Temu 趋势与 DVI 爆款指数 |
| **Step 5** | SEO & GEO 标杆流量网站拆解 | `analyze-country-market`, `cc-design` | 标杆词库、URL 架构、AI 引用结构与必赢要素 |
| **Step 6** | RenWork 21 模块企业知识库构建 | `renwork-export-kb-orchestrator` | 00–20 模块全量知识库与结构化知识卡 |
| **Step 7** | 知识库六态置信度审计与岗位视图 | `renwork-kb-governance-auditor` | 六态置信度台账、业务速查卡与 6 大岗位专属视图 |
| **Step 8** | 引流/利润/形象款组合与商业 Offer | `design-commercial-offer` | 三层产品梯队、FOB 阶梯报价、MOQ 与模具摊销 |
| **Step 9** | 海量 SKU (20-100+) 规范化批量生成 | `product-truth-builder` | 工业级规格标准 `products.json` 数据库 |
| **Step 10** | 纯净商业摄影图与细节生成 | `antigravity-image-gen` | Imagen 3 工业摄影提示词（无文字乱码/真实材质） |
| **Step 11** | 程序化 SEO 落地页与 Schema 图谱 | `b2b_portal_builder` | 语义化 HTML5 落地页与 Product/FAQ Schema |
| **Step 12** | 机器可读 GEO 四大端点生成 | `generate_llms_manifest.py` | `/llms.txt`, `/ai/summary.json`, `/ai/faq.json` 等 |
| **Step 13** | 多品类编译器执行与 XML 地图 | `b2b_portal_builder` | 分类网格、Pill 筛选器、Image Sitemap |
| **Step 14** | 生产环境打包、端口避坑与部署 | `deploy_remote.sh` | 排除 AppleDouble、SSH 2222 安全部署与 Nginx 重载 |
| **Step 15** | HTTP/2 巡检与 AI 搜索真机验证 | `verify_endpoints.py` | 25+ 端点健康检查与 Perplexity/SearchGPT 问答测试 |

---

## 3. 标准化作业 Prompts 详细定义

（详见正文每个步骤的标准提示词，支持带参宏替换：`{{COMPANY_NAME}}`, `{{TARGET_CATEGORY}}`, `{{NUMBER_OF_SKUS}}`, `{{LIVE_DOMAIN}}` 等）。

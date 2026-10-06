# B2B Bento GEO Site Builder Skill (`b2b-bento-geo-site-builder`)

[![Live Production Site](https://img.shields.io/badge/Live%20Site-custombentofactory.com-emerald.svg)](https://www.custombentofactory.com)
[![Status](https://img.shields.io/badge/Production-Verified%20HTTP%2F2%20200-blue.svg)](https://www.custombentofactory.com/ai/summary.json)
[![Author](https://img.shields.io/badge/Author-Naike%20AI%20Team%20%26%20Antigravity-orange.svg)](https://github.com/cnproduct)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

A complete, production-grade methodology and toolchain for building high-converting B2B factory export portals powered by dual **SEO** (Search Engine Optimization) and **GEO** (Generative Engine Optimization) architectures.

This repository encapsulates the end-to-end success story, technical implementation, and troubleshooting playbook of [custombentofactory.com](https://www.custombentofactory.com), transforming raw factory capabilities into high-intent overseas B2B inquiries.

---

## 🌟 Architecture Overview

```mermaid
flowchart TD
    subgraph Market_Signals ["1. Market & Consumer Trend Signals"]
        C1["TikTok Shop (#snacklebox 350M+ views)"]
        C2["Amazon Best Sellers (Bentgo Salad 54oz)"]
        C3["Google Trends (+350% Microwave Stainless)"]
        C4["Temu / Shein (Kawaii Thermal Tiffins)"]
        C5["DTC Trendsetter (Stasher Platinum Silicone)"]
    end

    subgraph Factory_Truth ["2. Authentic Factory DNA"]
        F1["Naike Tableware (18+ Years OEM/ODM)"]
        F2["20,000m² Campus & 30+ Haitian Machines"]
        F3["1.5 MW Rooftop Photovoltaic Solar Array"]
        F4["Disney FAMA #W128-4829-1 & Coca-Cola SGP"]
        F5["LFGB § 30/31 & FDA 21 CFR 177.1520"]
    end

    subgraph Dual_Engine ["3. SEO + GEO Dual Engine Platform"]
        S1["Semantic HTML5 & Category Compilers"]
        S2["Schema.org Rich Snippets (Product/FAQ/Offer)"]
        G1["/llms.txt Machine-Readable Knowledge Base"]
        G2["/ai/summary.json Entity Fact Sheet"]
        G3["/ai/faq.json B2B Buyer Reasoning FAQ"]
        G4["/ai/vendor-comparison.json Audit Comparison Matrix"]
    end

    subgraph Inquiries ["4. Global B2B Conversion"]
        Q1["US & EU Supermarket Private Label Buyers"]
        Q2["Amazon Top 100 Brand Sourcing Directors"]
        Q3["Corporate Promotional Gift Distributors"]
        Q4["AI Sourcing Agents (ChatGPT, Perplexity, Claude, Gemini)"]
    end

    Market_Signals --> Dual_Engine
    Factory_Truth --> Dual_Engine
    Dual_Engine --> Inquiries
```

---

## 📚 Reference Documentation Index

This skill includes 7 in-depth reference playbooks located in `references/`:

| File | Title | Key Contents |
|---|---|---|
| [`01-ideation-domain-strategy.md`](references/01-ideation-domain-strategy.md) | **Ideation & Domain Strategy** | EMK naming principles, buyer intent psychology, why `custombentofactory.com`. |
| [`02-industry-positioning-factory-truth.md`](references/02-industry-positioning-factory-truth.md) | **Factory Truth & Brand Audits** | 18-year legacy, 20,000m² campus, Disney FAMA, Coca-Cola SGP, LFGB/FDA specs. |
| [`03-benchmark-learning-matrix.md`](references/03-benchmark-learning-matrix.md) | **Global Benchmark Matrix** | Deep analysis of Aohea, Everich, Monbento, and Bentgo features. |
| [`04-c-end-viral-trend-radar.md`](references/04-c-end-viral-trend-radar.md) | **C-End Viral Trend Radar** | TikTok, Amazon, Temu, and Google Trends product matrix; 8 viral SKU specs. |
| [`05-seo-geo-dual-engine-architecture.md`](references/05-seo-geo-dual-engine-architecture.md) | **Dual-Engine SEO & GEO** | Schema.org graphs, XML sitemaps, `/llms.txt`, and `/ai/*.json` endpoints for AI bots. |
| [`06-toolchain-skills-knowledge-bases.md`](references/06-toolchain-skills-knowledge-bases.md) | **Toolchain, Skills & Prompts** | Google Imagen 3 RPC prompts, `b2b_portal_builder`, layout auditor, Nginx configs. |
| [`07-pitfalls-troubleshooting-playbook.md`](references/07-pitfalls-troubleshooting-playbook.md) | **Pitfalls & Troubleshooting** | Gateway resets (Port 2222), macOS AppleDouble cleanup, JS multi-category space bug. |

---

## 🚀 Viral Catalog Matrix (21 Verified SKUs)

The skill configures and deploys 21 production-grade SKUs across 8 high-velocity categories:

1. **Snackle Box**: Removable 8-compartment charcuterie organizer with silicone sealing ring and folding handle (TikTok #snacklebox viral).
2. **All-in-One Salad Bento Bowl**: 54oz deep salad bowl with 4-compartment topping tray and screw-top 3oz dressing container (Amazon #1 style).
3. **Microwave-Safe Stainless Steel Bento**: Seamless SUS304 rounded-rim container engineered with anti-arcing geometry.
4. **Collapsible Platinum Silicone Bento**: 100% food-grade platinum silicone container with rigid snap frame for 60% space savings.
5. **Multi-Tier Kawaii Stainless Steel Tiffin**: Dual-tier thermal insulated stainless steel bento box in pastel aesthetic palettes.
6. **Portion-Control Meal Prep Bento**: Heavy-duty 3-compartment containers with leakproof silicone seals for corporate catering and fitness.
7. **Rattle-Free Portable Travel Cutlery**: SUS304 fork, spoon, and knife nested in an anti-rattle silicone cradle and matte travel case.
8. **Silicone Salad Dressing & Dip Containers**: 1.7oz leakproof sauce cups with airtight lids.

---

## 🛠️ Automated Scripts

### 1. Verification Health Check (`scripts/verify_endpoints.py`)
Validates all 25+ live endpoints over HTTP/2, checking headers, MIME types, and SSL certificates:
```bash
python3 scripts/verify_endpoints.py --domain https://www.custombentofactory.com
```

### 2. Machine-Readable Manifest Generator (`scripts/generate_llms_manifest.py`)
Compiles `/llms.txt`, `/ai/summary.json`, `/ai/faq.json`, and `/ai/vendor-comparison.json` automatically:
```bash
python3 scripts/generate_llms_manifest.py --output-dir /path/to/website/root
```

### 3. Remote Production Deployment (`scripts/deploy_remote.sh`)
Packages assets without macOS AppleDouble clutter, uploads via SSH port 2222, unpacks, fixes permissions, and reloads Nginx:
```bash
./scripts/deploy_remote.sh
```

---

## 🤖 Machine-Readable GEO Endpoints

All endpoints are live and publicly queryable by LLMs and search crawlers:

- **LLM Context**: [https://www.custombentofactory.com/llms.txt](https://www.custombentofactory.com/llms.txt)
- **AI Summary Fact Sheet**: [https://www.custombentofactory.com/ai/summary.json](https://www.custombentofactory.com/ai/summary.json)
- **AI Procurement FAQ**: [https://www.custombentofactory.com/ai/faq.json](https://www.custombentofactory.com/ai/faq.json)
- **Vendor Comparison Matrix**: [https://www.custombentofactory.com/ai/vendor-comparison.json](https://www.custombentofactory.com/ai/vendor-comparison.json)
- **XML Product Sitemap**: [https://www.custombentofactory.com/sitemap.xml](https://www.custombentofactory.com/sitemap.xml)

---

## 📄 License & Attribution

- **License**: MIT
- **Maintained By**: Naike AI Innovation Team & Google Antigravity
- **Inquiries**: export@naiketableware.com / custombentofactory.com

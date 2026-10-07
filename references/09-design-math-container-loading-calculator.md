# 09 - 设计数学、流式字阶与便当盒集装箱装柜算法（Design Math & Logistics Engine）

融合 `b2b-global-brand-site-master` 中严谨的数学工具箱，外贸 B2B 网站不仅要呈现美学设计，更要为大宗采购决策提供可量化、精确计算的技术与物流底座。

---

## 一、 WCAG 2.1 颜色对比度数学模型（WCAG Contrast Math）

### 1. 相对亮度（Relative Luminance）公式
依据 W3C WCAG 2.1 规范，颜色空间基于 sRGB 伽马校正计算：
$$\text{Channel}_{\text{linear}} = \begin{cases} \frac{C}{12.92}, & C \le 0.04045 \\ \left(\frac{C + 0.055}{1.055}\right)^{2.4}, & C > 0.04045 \end{cases}$$
$$L = 0.2126 \cdot R_{\text{linear}} + 0.7152 \cdot G_{\text{linear}} + 0.0722 \cdot B_{\text{linear}}$$

### 2. 对比度比例（Contrast Ratio）
$$CR = \frac{L_{\text{light}} + 0.05}{L_{\text{dark}} + 0.05}$$
* **常规正文 (Body Text)**：必须满足 $CR \ge 4.5:1$（WCAG AA 级要求）；
* **大型标题 (Large Text $\ge 24\text{px}$ 或加粗 $\ge 18.66\text{px}$)**：必须满足 $CR \ge 3.0:1$。
* **脚本执行**：
  ```bash
  python3 scripts/design_math.py contrast '#112330' '#ffffff'
  # 输出: 16.425102:1 — PASS (AA text threshold 4.5:1)
  ```

---

## 二、 响应式流式字阶与间距计算（Fluid Typography & Spacing）

### 1. 线性插值与 CSS `clamp()` 算法
避免在移动端（320px–390px）与桌面端（1440px+）之间频繁使用断点媒体查询引起字号跳变，采用纯 CSS 连续流式缩放：
$$\text{Slope} = \frac{\text{MaxSize} - \text{MinSize}}{\text{MaxWidth} - \text{MinWidth}}$$
$$\text{Intercept} = \text{MinSize} - \text{Slope} \times \text{MinWidth}$$
$$\text{CSS Clamp} = \text{clamp}\left(\frac{\text{MinSize}}{16}\text{rem},\, \text{calc}\left(\frac{\text{Intercept}}{16}\text{rem} + (\text{Slope} \times 100)\text{vw}\right),\, \frac{\text{MaxSize}}{16}\text{rem}\right)$$

* **脚本执行**：
  ```bash
  python3 scripts/design_math.py fluid 28 48 360 1440
  # 输出: clamp(1.75rem, calc(1.333333333rem + 1.851851852vw), 3rem)
  ```

---

## 三、 便当盒大宗海运装柜容量测算模型（Container Loading Logistics）

大宗海外买家（如 Costco、Walmart、Target 或亚马逊大卖家）发起询盘时，首要核心关切是 **“一个 40HQ 集装箱能装多少个便当盒？FOB Xiamen 单柜运费平摊到单个餐盒是多少？”**

### 1. 国际集装箱规格标准参数
| 集装箱型号 | 理论内部体积 ($V_{\text{nom}}$) | 最大核载毛重 ($W_{\text{payload}}$) | 经验堆叠填充率 ($\eta$) |
|---|---|---|---|
| **20GP (标准小柜)** | $33.1\text{ m}^3$ | $21,800\text{ kg}$ | $85\% \sim 88\%$ |
| **40GP (平顶大柜)** | $67.5\text{ m}^3$ | $26,680\text{ kg}$ | $86\% \sim 89\%$ |
| **40HQ (高顶大柜)** | $76.2\text{ m}^3$ | $26,580\text{ kg}$ | $88\% \sim 90\%$ |

### 2. 装柜容量判定算法
1. 单外箱体积：$V_{\text{ctn}} = \frac{L_{\text{mm}} \times W_{\text{mm}} \times H_{\text{mm}}}{10^9}\text{ m}^3$
2. 体积限制箱数：$N_{\text{volume}} = \lfloor \frac{V_{\text{nom}} \times \eta}{V_{\text{ctn}}} \rfloor$
3. 重量限制箱数：$N_{\text{weight}} = \lfloor \frac{W_{\text{payload}}}{W_{\text{gross\_ctn}}} \rfloor$
4. 实际最大装箱数：$N_{\text{actual}} = \min(N_{\text{volume}},\, N_{\text{weight}})$
5. 总出货量：$\text{Total Units} = N_{\text{actual}} \times \text{PcsPerCarton}$

### 3. 便当盒典型实测数据对照
以主力款 **Bentgo 同款儿童 5 格防漏便当盒 (`NK-KB5-001`)** 为例：
* 外箱尺寸：$540 \times 380 \times 420\text{ mm}$，装箱数：24 pcs/箱，外箱毛重：$14.5\text{ kg}$
* 运行计算：
  ```bash
  python3 scripts/design_math.py container --length 540 --width 380 --height 420 --weight 14.5 --pcs 24
  ```
* **精准测算结果**：
  * **20GP**：可装 **337 箱 / 8,088 个**（总重 $4.88\text{ 吨}$，体积利用率 $87.7\%$，体积限制型）；
  * **40GP**：可装 **689 箱 / 16,536 个**（总重 $9.99\text{ 吨}$，体积利用率 $88.0\%$，体积限制型）；
  * **40HQ**：可装 **778 箱 / 18,672 个**（总重 $11.28\text{ 吨}$，体积利用率 $88.0\%$，体积限制型）。

此算法在独立站报价单（Quotation Sheet）、形式发票（PI）与买家询盘预估中为业务员和海外采购商提供不可辩驳的工业级事实支撑。

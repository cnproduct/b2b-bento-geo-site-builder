# 07 - 实战排坑与故障排除手册（Pitfalls & Troubleshooting Playbook）

在 `custombentofactory.com` 从零到一的架构设计、多次迭代部署与线上测试过程中，团队攻克了一系列极为隐蔽的工程与网络深水坑。本手册将所有踩坑经历和解决方案沉淀为标准化 SOP，供后续建站直接避坑。

---

## 坑位 1：云厂商网关重置标准 SSH 端口 22，导致连接超时或握手失败

### 故障现象
执行 `ssh ubuntu@43.130.32.54` 时，终端直接卡死或提示：
`ssh: connect to host 43.130.32.54 port 22: Connection reset by peer` 或 `Operation timed out`。

### 根因分析
该云服务器的外层安全组或机房硬件防火墙为了规避公网恶意爆破，将外网的 22 端口做了黑洞过滤或 RST 拦截；但真实 SSH 服务映射在 **`2222`** 端口上。

### 避坑黄金规则
所有针对该生产主机的自动化脚本、`scp`、`rsync`、`sshpass` 命令，**必须强制显式指定端口 2222**：
```bash
# 正确命令格式
/opt/homebrew/bin/sshpass -p 'WHJCwhjc2026' ssh -o StrictHostKeyChecking=no -p 2222 ubuntu@43.130.32.54
/opt/homebrew/bin/sshpass -p 'WHJCwhjc2026' scp -o StrictHostKeyChecking=no -P 2222 update.tar.gz ubuntu@43.130.32.54:/tmp/
```

---

## 坑位 2：macOS 打包默认生成 `._*` AppleDouble 资源分支文件，污染 Linux Web 根目录

### 故障现象
在 macOS 上使用 `tar -czvf update.tar.gz ...` 打包并上传到 Linux 服务器解压后，目录中充斥着成百上千个以 `._` 开头的隐藏垃圾文件（如 `._index.html`, `._products.html`）。这不仅会导致 `ls` 混乱，还可能被 Nginx 当作静态文件意外索引，甚至在 Git 仓库中造成脏提交。

### 根因分析
macOS 的 HFS+/APFS 文件系统包含扩展属性（Extended Attributes，如 `com.apple.quarantine`、`com.google.drivefs`）。原生 BSD `tar` 会自动为每个文件生成 AppleDouble `._` 镜像文件保存元数据。

### 自动化解决方案
1. **打包前禁用扩展属性导出**：
   ```bash
   export COPYFILE_DISABLE=1
   tar --no-xattrs -czvf update.tar.gz ...
   ```
2. **在远程服务器解压后执行兜底清理流水线**：
   ```bash
   sudo find /var/www/CustomBentoFactory.com -name "._*" -delete
   ```

---

## 坑位 3：JavaScript 弱类型字符串比较导致“多分类商品卡片”在筛选时失效

### 故障现象
在 `products.html` 中新增商品时，很多产品兼具多个标签属性（例如 TikTok 爆款多格盒既属于 `viral`，又属于 `kids-bento`）。若设置 `data-category="viral kids-bento"`，当点击 `Kids Bento Boxes` 标签时，该产品卡片竟然被隐藏了！

### 根因分析
原始 `js/main.js` 的过滤逻辑是严格全等匹配：
```javascript
// 错误旧代码：
if (cat === 'all' || cardCat === cat) { ... }
```
当 `cardCat` 为 `"viral kids-bento"`，而过滤标签 `cat` 为 `"kids-bento"` 时，`"viral kids-bento" === "kids-bento"` 返回 `false`，导致卡片被错误过滤。

### 修复方案
在 `js/main.js` 中引入空格拆分包含算法：
```javascript
// 正确新代码：
cards.forEach(card => {
  const cardCat = card.getAttribute('data-category');
  const match = (cat === 'all' || cardCat === cat || (cardCat && cardCat.split(/\s+/).includes(cat)));
  if (match) {
    card.style.display = 'flex';
    setTimeout(() => { card.style.opacity = '1'; }, 10);
  } else {
    card.style.opacity = '0';
    setTimeout(() => { card.style.display = 'none'; }, 200);
  }
});
```

---

## 坑位 4：跨国食品级安全混淆陷阱（五金工具箱 vs 食品级便当盒）

### 故障风险
TikTok 上爆火的“Snackle Box”原型是垂钓塑料渔具盒（Fishing Tackle Box）。部分不合规的国内小厂直接拿五金工具箱改标出海。但在欧美海关，工具箱塑料通常使用再生回料（Recycled Plastic）与重度邻苯二甲酸酯增塑剂。一旦被美国 FDA 或欧盟 RAPEX 快速预警系统抽检，将面临整柜就地销毁和高额跨国诉讼。

### 供应链合规防御方案
1. 网站文案中严正声明：**“100% Virgin Food-Grade Polypropylene (PP 5) + Platinum Food Silicone Seal”**，不使用任何低成本工业工具盒注塑模具；
2. 页面中主动披露 **FDA 21 CFR 177.1520 与 German LFGB §30/31 报告**，将“正规食品级安全”塑造为对抗劣质低价竞争对手的杀手锏。

---

## 坑位 5：Linux 服务器权限与 Nginx 虚拟主机端口复用警告

### 故障现象
运行 `sudo nginx -t` 时提示：
`protocol options redefined for 0.0.0.0:443 in /etc/nginx/sites-enabled/...`

### 根因分析
在同一台 VPS 上托管了多个独立站虚拟主机（Virtual Hosts），部分配置文件在 `listen 443 ssl http2;` 中重复声明了全局参数。

### 解决机制
1. 这属于 Nginx 的 warning 级别，不会阻断服务运行，但需统一清理多余的重复参数；
2. 部署后必须保证网站目录所有权为 `ubuntu:www-data`，且权限为 `755`，防止 Nginx Worker 进程因为无读权限抛出 HTTP 403 Forbidden：
   ```bash
   sudo chown -R ubuntu:www-data /var/www/CustomBentoFactory.com
   sudo chmod -R 755 /var/www/CustomBentoFactory.com
   ```

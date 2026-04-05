# 宝可梦模块部署指南

## 📋 部署步骤

### 第一步：初始化数据库表结构

在 Supabase SQL Editor 中依次执行以下 SQL 文件：

1. **初始化表结构**
   ```bash
   # 执行 init_pokemon_tables.sql
   ```
   这会创建所有必要的表：
   - `pet_species` - 宝可梦种类
   - `owned_pets` - 玩家拥有的宝可梦
   - `pet_items` - 宠物物品
   - `pet_redemptions` - 物品购买记录

2. **修复现有表（如果表已存在）**
   ```bash
   # 执行 fix_pet_items_table.sql
   ```
   这会添加缺失的 `effect` 和 `effect_value` 列

### 第二步：初始化数据

在本地运行初始化脚本：

```bash
cd C:/Users/Administrator/family-tasks
node init-pikachu.js
```

这会在数据库中创建：
- ⚡ 皮卡丘进化链（皮丘 → 皮卡丘 → 雷丘）
- 💎 5种进化石（雷、火、水、叶、月）
- 🎁 5种宠物用品（食物、饮料、清洁、玩具、糖果）

### 第三步：构建项目

```bash
cd C:/Users/Administrator/family-tasks
npm run build
```

### 第四步：部署到服务器

如果你有服务器访问权限：

```bash
# 上传 dist 目录到服务器
scp -r dist/* user@server:/var/www/html/

# 或者在服务器上直接构建
ssh user@server
cd /root/.openclaw/workspace/family-tasks
git pull
npm run build
cp -r dist/* /var/www/html/
```

## 🎮 功能说明

### 主界面
- 显示当前选中的宝可梦
- 显示等级、经验值、4个状态条
- 底部4个按钮：进化、切换、商店、互动

### 进化路线
- 显示完整进化链
- 显示进化条件（等级/进化石）
- 绿色✓表示满足条件，红色✗表示不满足

### 更换宝可梦
- **我的宝可梦**：切换已拥有的宝可梦
- **领养中心**：花费积分领养新宝可梦

### 物品商店
- 购买进化石和宠物用品
- 查看我的物品背包

### 互动面板
- 喂食（2积分）：饱腹度+20
- 喝水（1积分）：口渴度+20
- 洗澡（3积分）：清洁度+20
- 玩耍（2积分）：心情度+20

## 📁 项目文件结构

```
family-tasks/
├── src/
│   ├── components/
│   │   └── child/
│   │       ├── PokemonHome.jsx          # 主界面
│   │       └── pokemon/
│   │           ├── PikachuSVG.jsx       # 皮卡丘SVG
│   │           ├── EvolutionView.jsx    # 进化路线
│   │           ├── PokemonSwitcher.jsx  # 宝可梦切换
│   │           ├── ItemShop.jsx         # 物品商店
│   │           └── InteractionPanel.jsx # 互动面板
│   └── views/
│       └── ChildView.jsx                # 入口视图
├── init-pikachu.js                      # 数据初始化脚本
├── init_pokemon_tables.sql              # 表结构初始化
├── fix_pet_items_table.sql              # 表结构修复
└── DEPLOYMENT_GUIDE.md                  # 本文件
```

## 🐛 常见问题

### 1. 数据库错误：找不到 effect 列
**解决方案**：在 Supabase SQL Editor 中执行 `fix_pet_items_table.sql`

### 2. 初始化脚本失败
**解决方案**：
- 检查 Supabase URL 和 API Key 是否正确
- 确保已执行表结构初始化 SQL
- 检查网络连接

### 3. 构建失败
**解决方案**：
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 4. 页面显示空白
**解决方案**：
- 检查浏览器控制台错误
- 确保数据库中有数据
- 检查 Supabase 配置

## 🔧 后续扩展

### 添加新宝可梦
1. 在 Supabase 的 `pet_species` 表中插入新数据
2. 创建对应的 SVG 组件（参考 PikachuSVG.jsx）
3. 在 PokemonHome.jsx 中添加条件渲染

### 添加新物品
1. 在 Supabase 的 `pet_items` 表中插入新数据
2. 物品会自动显示在商店中

## 📞 技术支持

如有问题，请检查：
1. Supabase 数据库连接
2. 表结构是否完整
3. 数据是否已初始化
4. 浏览器控制台错误信息

---

*最后更新: 2026-04-05*

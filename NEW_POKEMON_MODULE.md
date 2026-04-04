# 新宠物模块使用指南

## 🎮 功能概述

全新的宝可梦风格宠物系统，包含：

1. **主界面** - 显示单只宝可梦，带互动动画
2. **进化路线** - 查看进化链、等级要求、材料需求
3. **更换宝可梦** - 领养新宝可梦 + 切换显示的宝可梦
4. **物品商店** - 购买进化石和宠物用品
5. **互动面板** - 喂食、喝水、洗澡、玩耍

## 📁 新增文件

```
src/components/child/
├── PokemonHome.jsx              # 主界面（入口）
└── pokemon/
    ├── PikachuSVG.jsx          # 皮卡丘SVG形象
    ├── EvolutionView.jsx       # 进化路线查看
    ├── PokemonSwitcher.jsx     # 宝可梦切换器
    ├── ItemShop.jsx            # 物品商店
    └── InteractionPanel.jsx    # 互动面板

init-pikachu.js                  # 数据初始化脚本
```

## 🚀 部署步骤

### 1. 初始化数据库数据

在本地运行初始化脚本：

```bash
cd /c/Users/Administrator/family-tasks
node init-pikachu.js
```

这会在 Supabase 中创建：
- 皮丘、皮卡丘、雷丘（进化链）
- 5种进化石（雷、火、水、叶、月）
- 5种宠物用品（食物、饮料、清洁、玩具、糖果）

### 2. 上传代码到服务器

将新文件上传到服务器：

```bash
# 在服务器上
cd /root/.openclaw/workspace/family-tasks

# 创建 pokemon 子目录
mkdir -p src/components/child/pokemon

# 上传以下文件：
# - src/components/child/PokemonHome.jsx
# - src/components/child/pokemon/PikachuSVG.jsx
# - src/components/child/pokemon/EvolutionView.jsx
# - src/components/child/pokemon/PokemonSwitcher.jsx
# - src/components/child/pokemon/ItemShop.jsx
# - src/components/child/pokemon/InteractionPanel.jsx
# - src/views/ChildView.jsx (已更新)
# - src/index.css (已更新)
```

### 3. 构建和部署

```bash
# 在服务器上构建
cd /root/.openclaw/workspace/family-tasks
npm run build

# 部署到 Nginx
cp -r dist/* /var/www/html/

# 重启 Nginx（如果需要）
sudo systemctl reload nginx
```

### 4. 访问测试

访问 http://familytasks.cn
- 选择"孩子"
- 选择一个孩子
- 现在会看到新的宝可梦界面

## 🎨 界面说明

### 主界面
- 显示当前选中的宝可梦
- 显示等级、经验值
- 显示4个状态条（饱腹、口渴、清洁、心情）
- 底部4个按钮：进化、切换、商店、互动

### 进化路线
- 显示完整进化链
- 显示进化条件（等级/进化石）
- 显示当前拥有的进化石
- 绿色✓表示满足条件，红色✗表示不满足

### 更换宝可梦
- **我的宝可梦**：显示已拥有的宝可梦，点击切换
- **领养中心**：花费积分领养新宝可梦

### 物品商店
- 显示可购买的物品
- 显示我的物品背包
- 点击物品购买

### 互动面板
- 喂食（2积分）：饱腹度+20
- 喝水（1积分）：口渴度+20
- 洗澡（3积分）：清洁度+20
- 玩耍（2积分）：心情度+20
- 所有互动都会增加经验值

## 🎯 皮卡丘动画

皮卡丘SVG支持以下动画：
- `idle` - 默认浮动
- `happy` - 开心弹跳（带星星特效）
- `eating` - 吃东西（显示苹果）
- `drinking` - 喝水（显示水滴）
- `bathing` - 洗澡（显示泡泡）
- `playing` - 玩耍（显示爱心）

## 📊 数据结构

### pet_species 表
- 存储宝可梦种类信息
- 包含进化链关系
- 包含属性类型

### owned_pets 表
- 存储玩家拥有的宝可梦
- 包含等级、经验值
- 包含4个状态值

### pet_items 表
- 存储物品信息
- 包含效果类型和数值

### pet_redemptions 表
- 存储物品购买记录
- 标记是否已使用

## 🔧 后续扩展

### 添加新宝可梦
1. 在 Supabase 的 `pet_species` 表中插入新数据
2. 创建对应的 SVG 组件（参考 PikachuSVG.jsx）
3. 在 PokemonHome.jsx 中添加条件渲染

### 添加新物品
1. 在 Supabase 的 `pet_items` 表中插入新数据
2. 物品会自动显示在商店中

### 自定义动画
1. 在 index.css 中添加新的 @keyframes
2. 在 PikachuSVG.jsx 中使用新动画

## 🐛 已知问题

1. 目前只实现了皮卡丘的SVG形象
2. 进化功能需要手动触发（后续可添加自动进化）
3. 宠物状态不会自动衰减（需要添加定时任务）

## 📝 TODO

- [ ] 添加更多宝可梦（伊布、小火龙等）
- [ ] 实现自动进化功能
- [ ] 添加宠物状态自动衰减
- [ ] 添加宠物对战功能
- [ ] 添加宠物图鉴
- [ ] 添加成就系统

## 💡 提示

- 初次使用需要先领养宝可梦
- 建议先领养皮卡丘（100积分）
- 互动需要消耗积分，记得完成任务赚取积分
- 进化需要满足等级或拥有进化石

---

*最后更新: 2026-04-04*

# 宝可梦模块 - 快速开始

## 🚀 一键部署

```bash
cd C:/Users/Administrator/family-tasks
bash deploy-pokemon-complete.sh
```

## 📋 手动部署步骤

### 1. 初始化数据库

在 Supabase SQL Editor 中执行：
- `init_pokemon_tables.sql` - 创建所有表
- `fix_pet_items_table.sql` - 修复现有表（如果需要）

### 2. 初始化数据

```bash
node init-pikachu.js
```

### 3. 构建项目

```bash
npm run build
```

### 4. 本地测试

```bash
npm run dev
```

访问 http://localhost:5173

## 📁 重要文件

- `init_pokemon_tables.sql` - 数据库表结构
- `fix_pet_items_table.sql` - 修复表结构
- `init-pikachu.js` - 初始化数据
- `deploy-pokemon-complete.sh` - 一键部署脚本
- `DEPLOYMENT_GUIDE.md` - 详细部署指南

## 🎮 功能列表

✅ 宝可梦主界面
✅ 进化路线查看
✅ 宝可梦切换/领养
✅ 物品商店
✅ 互动面板（喂食、喝水、洗澡、玩耍）
✅ 皮卡丘 SVG 动画
✅ 进化链系统（皮丘 → 皮卡丘 → 雷丘）

## 🐛 问题排查

### 数据库错误
- 确保已执行 SQL 初始化脚本
- 检查 Supabase 连接配置

### 构建失败
```bash
rm -rf node_modules
npm install
npm run build
```

### 数据初始化失败
- 检查 `init-pikachu.js` 中的 Supabase URL 和 API Key
- 确保数据库表结构已创建

## 📞 下一步

1. 执行部署脚本
2. 访问应用
3. 领养你的第一只宝可梦
4. 开始互动和进化！

---

*项目状态: ✅ 已完成，可以部署*

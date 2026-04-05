#!/bin/bash

# 宝可梦项目部署检查清单
# 使用方法：bash checklist.sh

echo "🎮 宝可梦项目部署检查清单"
echo "================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查项目目录
echo "📁 检查 1: 项目文件"
echo "-----------------------------------"
if [ -f "package.json" ]; then
  echo -e "${GREEN}✓${NC} package.json 存在"
else
  echo -e "${RED}✗${NC} package.json 不存在"
  exit 1
fi

if [ -f "src/components/child/PokemonHome.jsx" ]; then
  echo -e "${GREEN}✓${NC} PokemonHome.jsx 存在"
else
  echo -e "${RED}✗${NC} PokemonHome.jsx 不存在"
fi

if [ -d "src/components/child/pokemon" ]; then
  echo -e "${GREEN}✓${NC} pokemon 子目录存在"

  # 检查所有必需的组件
  components=("PikachuSVG.jsx" "EvolutionView.jsx" "PokemonSwitcher.jsx" "ItemShop.jsx" "InteractionPanel.jsx")
  for comp in "${components[@]}"; do
    if [ -f "src/components/child/pokemon/$comp" ]; then
      echo -e "  ${GREEN}✓${NC} $comp"
    else
      echo -e "  ${RED}✗${NC} $comp 缺失"
    fi
  done
else
  echo -e "${RED}✗${NC} pokemon 子目录不存在"
fi

echo ""
echo "📄 检查 2: 数据库脚本"
echo "-----------------------------------"
if [ -f "init_pokemon_tables.sql" ]; then
  echo -e "${GREEN}✓${NC} init_pokemon_tables.sql 存在"
else
  echo -e "${RED}✗${NC} init_pokemon_tables.sql 不存在"
fi

if [ -f "fix_pet_items_table.sql" ]; then
  echo -e "${GREEN}✓${NC} fix_pet_items_table.sql 存在"
else
  echo -e "${RED}✗${NC} fix_pet_items_table.sql 不存在"
fi

if [ -f "init-pikachu.js" ]; then
  echo -e "${GREEN}✓${NC} init-pikachu.js 存在"
else
  echo -e "${RED}✗${NC} init-pikachu.js 不存在"
fi

echo ""
echo "🔨 检查 3: 项目构建"
echo "-----------------------------------"
if [ -d "node_modules" ]; then
  echo -e "${GREEN}✓${NC} node_modules 存在"
else
  echo -e "${YELLOW}⚠${NC} node_modules 不存在，需要运行 npm install"
fi

if [ -d "dist" ]; then
  echo -e "${GREEN}✓${NC} dist 目录存在（已构建）"
else
  echo -e "${YELLOW}⚠${NC} dist 目录不存在，需要运行 npm run build"
fi

echo ""
echo "📋 检查 4: 文档"
echo "-----------------------------------"
docs=("DEPLOYMENT_GUIDE.md" "README_POKEMON.md" "PROJECT_STATUS.md")
for doc in "${docs[@]}"; do
  if [ -f "$doc" ]; then
    echo -e "${GREEN}✓${NC} $doc"
  else
    echo -e "${YELLOW}⚠${NC} $doc 不存在"
  fi
done

echo ""
echo "================================"
echo "📊 检查完成"
echo ""
echo "🎯 下一步操作："
echo ""
echo "1️⃣  在 Supabase SQL Editor 中执行数据库脚本"
echo "   ${YELLOW}→${NC} 打开 init_pokemon_tables.sql"
echo "   ${YELLOW}→${NC} 复制内容到 Supabase SQL Editor"
echo "   ${YELLOW}→${NC} 点击 Run"
echo ""
echo "2️⃣  初始化宝可梦数据"
echo "   ${YELLOW}→${NC} node init-pikachu.js"
echo ""
echo "3️⃣  本地测试"
echo "   ${YELLOW}→${NC} npm run dev"
echo "   ${YELLOW}→${NC} 访问 http://localhost:5173"
echo ""
echo "4️⃣  构建和部署"
echo "   ${YELLOW}→${NC} npm run build"
echo "   ${YELLOW}→${NC} 上传 dist 目录到服务器"
echo ""
echo "📖 详细说明请查看："
echo "   - DEPLOYMENT_GUIDE.md (详细部署指南)"
echo "   - README_POKEMON.md (快速开始)"
echo "   - PROJECT_STATUS.md (项目状态)"
echo ""

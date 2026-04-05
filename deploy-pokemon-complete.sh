#!/bin/bash

# 宝可梦模块一键部署脚本
# 使用方法：bash deploy-pokemon-complete.sh

set -e

echo "🎮 宝可梦模块一键部署脚本"
echo "================================"
echo ""

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
  echo "❌ 错误：请在 family-tasks 项目根目录下运行此脚本"
  exit 1
fi

echo "📍 当前目录：$(pwd)"
echo ""

# 步骤1：检查数据库表结构
echo "📋 步骤 1/4: 检查数据库表结构"
echo "-----------------------------------"
echo "⚠️  请手动在 Supabase SQL Editor 中执行以下文件："
echo "   1. init_pokemon_tables.sql (如果是首次部署)"
echo "   2. fix_pet_items_table.sql (如果表已存在但缺少列)"
echo ""
read -p "已执行 SQL 文件？(y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ 部署取消"
  exit 1
fi

# 步骤2：初始化数据
echo ""
echo "📦 步骤 2/4: 初始化宝可梦数据"
echo "-----------------------------------"
if [ -f "init-pikachu.js" ]; then
  echo "正在运行 init-pikachu.js..."
  node init-pikachu.js
  if [ $? -eq 0 ]; then
    echo "✅ 数据初始化成功"
  else
    echo "❌ 数据初始化失败，请检查错误信息"
    exit 1
  fi
else
  echo "❌ 找不到 init-pikachu.js 文件"
  exit 1
fi

# 步骤3：构建项目
echo ""
echo "🔨 步骤 3/4: 构建项目"
echo "-----------------------------------"
echo "正在运行 npm run build..."
npm run build
if [ $? -eq 0 ]; then
  echo "✅ 项目构建成功"
else
  echo "❌ 项目构建失败"
  exit 1
fi

# 步骤4：部署选项
echo ""
echo "🚀 步骤 4/4: 部署"
echo "-----------------------------------"
echo "请选择部署方式："
echo "  1) 本地测试（npm run dev）"
echo "  2) 部署到服务器（需要服务器访问权限）"
echo "  3) 仅构建，稍后手动部署"
read -p "请选择 (1/2/3): " -n 1 -r
echo ""

case $REPLY in
  1)
    echo "🌐 启动本地开发服务器..."
    echo "访问 http://localhost:5173"
    npm run dev
    ;;
  2)
    echo "📤 准备部署到服务器..."
    read -p "请输入服务器地址 (例如: user@server.com): " SERVER
    read -p "请输入部署路径 (例如: /var/www/html): " DEPLOY_PATH
    echo "正在上传文件到 $SERVER:$DEPLOY_PATH ..."
    scp -r dist/* "$SERVER:$DEPLOY_PATH/"
    if [ $? -eq 0 ]; then
      echo "✅ 部署成功！"
    else
      echo "❌ 部署失败"
      exit 1
    fi
    ;;
  3)
    echo "✅ 构建完成，dist 目录已准备好"
    echo "你可以手动将 dist 目录的内容上传到服务器"
    ;;
  *)
    echo "❌ 无效选择"
    exit 1
    ;;
esac

echo ""
echo "🎉 部署流程完成！"
echo ""
echo "📝 接下来："
echo "  1. 访问你的应用"
echo "  2. 选择一个孩子"
echo "  3. 进入宝可梦界面"
echo "  4. 领养你的第一只宝可梦！"
echo ""
echo "💡 提示："
echo "  - 皮丘: 50积分"
echo "  - 皮卡丘: 100积分"
echo "  - 雷丘: 200积分"
echo ""

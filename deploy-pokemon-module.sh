#!/bin/bash

# Family Tasks 新宠物模块部署脚本
# 使用方法：在服务器上运行 bash deploy-pokemon-module.sh

echo "🚀 开始部署新宠物模块..."

cd /root/.openclaw/workspace/family-tasks

# 创建必要的目录
echo "📁 创建目录..."
mkdir -p src/components/child/pokemon

# 备份现有文件
echo "💾 备份现有文件..."
cp src/views/ChildView.jsx src/views/ChildView.jsx.backup 2>/dev/null || true
cp src/index.css src/index.css.backup 2>/dev/null || true

echo "✅ 目录准备完成"
echo ""
echo "📝 接下来需要手动操作："
echo ""
echo "1. 将以下文件从本地上传到服务器："
echo "   - src/components/child/PokemonHome.jsx"
echo "   - src/components/child/pokemon/PikachuSVG.jsx"
echo "   - src/components/child/pokemon/EvolutionView.jsx"
echo "   - src/components/child/pokemon/PokemonSwitcher.jsx"
echo "   - src/components/child/pokemon/ItemShop.jsx"
echo "   - src/components/child/pokemon/InteractionPanel.jsx"
echo "   - src/views/ChildView.jsx (已更新)"
echo "   - src/index.css (已更新)"
echo "   - init-pikachu.js"
echo ""
echo "2. 上传完成后，运行："
echo "   node init-pikachu.js"
echo "   npm run build"
echo "   cp -r dist/* /var/www/html/"
echo ""
echo "📌 提示：可以使用 scp 或 SFTP 工具上传文件"

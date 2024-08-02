#!/bin/sh

# 删除 packages 目录下所有子目录的 dist 和 node_modules 目录
for dir in packages/*/; do
  if [ -d "$dir" ]; then
    rm -rf "$dir/dist" "$dir/node_modules"
  fi
done

# 删除当前目录下的 node_modules 目录
if [ -d "node_modules" ]; then
  rm -rf "node_modules"
fi

# 删除 src 目录下的 .umi 目录
if [ -d "src/.umi" ]; then
  rm -rf "src/.umi"
fi
n
echo "💐 Clear done!"

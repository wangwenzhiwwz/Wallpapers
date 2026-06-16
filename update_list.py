import os
import json
import re
from pathlib import Path

from PIL import Image, ImageOps

# 目录与文件配置
image_dir = Path('images')
thumb_dir = Path('thumbs')
script_file = Path('script.js')
thumb_width = 420
thumb_quality = 76

# 获取 images 文件夹下所有支持的图片文件
valid_extensions = {'.jpg', '.jpeg', '.png', '.webp'}
image_files = []

thumb_dir.mkdir(exist_ok=True)


def thumb_path_for(image_path):
    return thumb_dir / f"{image_path.name}.webp"


def generate_thumbnail(image_path):
    thumb_path = thumb_path_for(image_path)
    if thumb_path.exists() and thumb_path.stat().st_mtime >= image_path.stat().st_mtime:
        return False

    with Image.open(image_path) as image:
        image = ImageOps.exif_transpose(image)
        image.thumbnail((thumb_width, thumb_width * 3), Image.Resampling.LANCZOS)

        if image.mode not in ('RGB', 'RGBA'):
            image = image.convert('RGB')

        image.save(thumb_path, 'WEBP', quality=thumb_quality, method=6)

    return True


generated_count = 0

for image_path in image_dir.iterdir():
    ext = image_path.suffix.lower()
    if ext in valid_extensions:
        if generate_thumbnail(image_path):
            generated_count += 1
        # 拼接成相对路径
        image_files.append(f"images/{image_path.name}")

# 核心优化：按文件名（时间戳）倒序排列
# 确保最新的图片永远在最前面，且每次 GitHub Actions 提交时的 Git Diff 保持干净整洁
image_files.sort(reverse=True)

# 将列表转换为格式化的 JSON 字符串（即 JS 数组格式）
js_array_str = json.dumps(image_files, indent=4)
replacement = f"const wallpapers = {js_array_str};"

# 读取当前的 script.js 内容
with open(script_file, 'r', encoding='utf-8') as f:
    content = f.read()

# 使用正则表达式定位并替换原来的 wallpapers 数组
# 注意：这会替换掉 const wallpapers = [ ... ]; 之间的所有内容
new_content = re.sub(
    r'const wallpapers\s*=\s*\[.*?\];', 
    replacement, 
    content, 
    flags=re.DOTALL
)

# 将新内容写回 script.js
with open(script_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Successfully updated script.js with {len(image_files)} images.")
print(f"Generated or refreshed {generated_count} thumbnails in {thumb_dir}/.")

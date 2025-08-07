import os
import json

image_folder = 'images'
output_file = 'images.json'
allowed_ext = ['.jpg', '.jpeg', '.png', '.gif', '.webp']

def parse_filename(filename):
    name, _ = os.path.splitext(filename)
    parts = name.split('_')
    label = parts[-1]
    tags = parts[:-1]
    return {
        'filename': filename,
        'label': label,
        'tags': tags
    }

images = []

for fname in os.listdir(image_folder):
    if any(fname.lower().endswith(ext) for ext in allowed_ext):
        images.append(parse_filename(fname))

with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(images, f, ensure_ascii=False, indent=2)

print(f"✅ 生成完毕：{output_file}（共 {len(images)} 项）")

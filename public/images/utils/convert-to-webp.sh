#!/bin/bash
# تحويل الصور إلى صيغة WebP

for file in $(find /path/to/images -name '*.jpg' -o -name '*.png'); do
  cwebp -q 80 "$file" -o "${file%.*}.webp"
  echo "تم تحويل $file إلى WebP"
done

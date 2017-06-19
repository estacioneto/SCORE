echo ">>> Starting minify"
gulp copy

# echo ">>> Replacing dirs"
# TEMP=$(cat src/main/index.html)
# rm src/main/index.html
# echo "$TEMP" | sed -e 's/\/vendor/..\/..\/vendor/g' > src/main/index.html

# echo ">>> Replacing done"
echo ">>> Starting gulp minify - lasts around 30 seconds"
gulp usemin
echo ">>> Done minifying"

# echo ">>> Removing old files"
# rm -rf src/main/js
# rm -rf src/main/config
# rm -rf src/main/css
# rm src/main/index.html

# echo ">>> Copying new files"
# cp -r dist/css src/main/css
# cp -r dist/js src/main/js
# cp dist/index.html src/main/index.html

echo ">>> Done"
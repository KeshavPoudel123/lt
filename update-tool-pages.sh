#!/bin/bash
echo "Updating tool pages to include floating-home-button.css..."

# Loop through all tool directories
for dir in tools/*/; do
    if [ -f "${dir}index.html" ]; then
        echo "Processing ${dir}index.html"
        
        # Use sed to insert the CSS link
        sed -i 's|\(^\s*<!-- Common CSS -->\n\s*<link rel="stylesheet" href="../../assets/css/styles.css">\)|\1\n    <link rel="stylesheet" href="../../assets/css/floating-home-button.css">|' "${dir}index.html"
        
        echo "Updated ${dir}index.html"
    fi
done

echo "All tool pages have been updated!"

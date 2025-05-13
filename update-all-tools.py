#!/usr/bin/env python3
import os
import re

def update_html_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    updated_content = content
    updates_made = []

    # 1. Add floating-home-button.css if not already present
    if "floating-home-button.css" not in updated_content:
        # Different patterns to match different HTML structures
        patterns = [
            # Pattern 1: Standard structure with <!-- Common CSS --> comment
            (r'(<!-- Common CSS -->[\s\n]*<link rel="stylesheet" href="../../assets/css/styles.css">)',
             r'\1\n    <link rel="stylesheet" href="../../assets/css/floating-home-button.css">'),

            # Pattern 2: Main CSS without comment
            (r'(<link rel="stylesheet" href="../../assets/css/styles.css">)',
             r'\1\n    <link rel="stylesheet" href="../../assets/css/floating-home-button.css">'),

            # Pattern 3: For pages with inline styles
            (r'(</style>)',
             r'\1\n    <link rel="stylesheet" href="../../assets/css/floating-home-button.css">'),
        ]

        css_updated = False

        # Try each pattern until one works
        for pattern, replacement in patterns:
            if re.search(pattern, updated_content):
                updated_content = re.sub(pattern, replacement, updated_content, count=1)
                css_updated = True
                updates_made.append("Added floating-home-button.css")
                break

        # If no pattern matched, try to insert before </head>
        if not css_updated:
            head_pattern = r'(</head>)'
            head_replacement = r'    <link rel="stylesheet" href="../../assets/css/floating-home-button.css">\n\1'
            if re.search(head_pattern, updated_content):
                updated_content = re.sub(head_pattern, head_replacement, updated_content, count=1)
                css_updated = True
                updates_made.append("Added floating-home-button.css")

    # 2. Remove dark toggle and settings buttons
    tool_actions_pattern = r'<div class="tool-actions">.*?</div>\s*'
    if re.search(tool_actions_pattern, updated_content, re.DOTALL):
        updated_content = re.sub(tool_actions_pattern, '', updated_content, flags=re.DOTALL)
        updates_made.append("Removed tool actions (dark toggle and settings)")

    # 3. Fix duplicate tool name
    # First, find the tool title in the header
    tool_title_match = re.search(r'<h1 class="tool-title">(.*?)</h1>', updated_content)
    if tool_title_match:
        tool_title = tool_title_match.group(1)
        # Look for the same title in the tool description
        tool_desc_pattern = r'<div class="tool-description">\s*<h2>' + re.escape(tool_title) + r'</h2>'
        if re.search(tool_desc_pattern, updated_content):
            # Replace with empty h2 to maintain structure but remove duplicate text
            updated_content = re.sub(tool_desc_pattern, r'<div class="tool-description">\n                        <h2></h2>', updated_content)
            updates_made.append("Removed duplicate tool title")

    # 4. Remove copyright notice from footer
    copyright_pattern = r'<p>&copy;.*?All rights reserved\.</p>'
    if re.search(copyright_pattern, updated_content):
        updated_content = re.sub(copyright_pattern, '<p></p>', updated_content)
        updates_made.append("Removed copyright notice")

    # 5. Replace home button with floating home button
    home_button_patterns = [
        # Pattern 1: Standard home button
        (r'<!-- Home Button -->\s*<a href="../../index\.html" class="home-button"[^>]*>.*?</a>',
         r'<!-- Floating Home Button -->\n        <a href="../../index.html" class="floating-home-btn">\n            <span class="material-icons">home</span>\n            <span>Home</span>\n        </a>'),

        # Pattern 2: Home button with different class
        (r'<a href="../../index\.html"[^>]*class="[^"]*home[^"]*"[^>]*>.*?</a>',
         r'<!-- Floating Home Button -->\n        <a href="../../index.html" class="floating-home-btn">\n            <span class="material-icons">home</span>\n            <span>Home</span>\n        </a>')
    ]

    home_button_updated = False
    for pattern, replacement in home_button_patterns:
        if re.search(pattern, updated_content, re.DOTALL):
            updated_content = re.sub(pattern, replacement, updated_content, flags=re.DOTALL)
            home_button_updated = True
            updates_made.append("Replaced home button with floating home button")
            break

    # 6. Add floating-home-button.js if not already present
    if "floating-home-button.js" not in updated_content:
        # Try to add before the closing body tag
        js_patterns = [
            # Pattern 1: Before tool-specific JavaScript
            (r'(<!-- Tool-specific JavaScript -->)',
             r'<!-- Floating Home Button JavaScript -->\n    <script src="../../assets/js/floating-home-button.js"></script>\n\n    \1'),

            # Pattern 2: After common JavaScript
            (r'(<!-- Common JavaScript -->.*?</script>)',
             r'\1\n\n    <!-- Floating Home Button JavaScript -->\n    <script src="../../assets/js/floating-home-button.js"></script>'),

            # Pattern 3: Before closing body tag
            (r'(</body>)',
             r'    <!-- Floating Home Button JavaScript -->\n    <script src="../../assets/js/floating-home-button.js"></script>\n\1')
        ]

        js_updated = False
        for pattern, replacement in js_patterns:
            if re.search(pattern, updated_content, re.DOTALL):
                updated_content = re.sub(pattern, replacement, updated_content, flags=re.DOTALL, count=1)
                js_updated = True
                updates_made.append("Added floating-home-button.js")
                break

    # Check if any updates were made
    if updates_made:
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(updated_content)
        print(f"Updated {file_path}: {', '.join(updates_made)}")
    else:
        print(f"No updates needed for: {file_path}")

def update_css_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()

        # Check if the file contains .tool-title class
        if '.tool-title' in content:
            # Extract the .tool-title rule
            tool_title_match = re.search(r'\.tool-title\s*\{[^}]*\}', content)
            if tool_title_match:
                tool_title_rule = tool_title_match.group(0)

                # Check if margin is already set to 20px 0
                if 'margin: 20px 0' in tool_title_rule:
                    return False

                # Check if margin is set to something else
                margin_match = re.search(r'margin:\s*([^;]+);', tool_title_rule)
                if margin_match:
                    # Replace existing margin with 20px 0
                    new_rule = re.sub(r'margin:\s*([^;]+);', 'margin: 20px 0;', tool_title_rule)
                    content = content.replace(tool_title_rule, new_rule)
                else:
                    # Add margin property if it doesn't exist
                    new_rule = tool_title_rule.replace('}', 'margin: 20px 0;}')
                    content = content.replace(tool_title_rule, new_rule)

                with open(file_path, 'w', encoding='utf-8') as file:
                    file.write(content)
                print(f"Updated tool-title margin in {file_path}")
                return True

        return False
    except Exception as e:
        print(f"Error updating CSS file {file_path}: {e}")
        return False

def create_tool_title_css(tool_dir):
    """Create or update CSS file with tool-title margin"""
    css_dir = os.path.join(tool_dir, "assets", "css")

    # Create css directory if it doesn't exist
    if not os.path.exists(css_dir):
        os.makedirs(css_dir)

    # Path to styles.css
    styles_css_path = os.path.join(css_dir, "styles.css")

    # Check if styles.css exists
    if os.path.exists(styles_css_path):
        with open(styles_css_path, 'r', encoding='utf-8') as file:
            content = file.read()

        # Check if .tool-title exists in the file
        if '.tool-title' in content:
            # Already handled by update_css_file
            return False
        else:
            # Append tool-title class to existing styles.css
            with open(styles_css_path, 'a', encoding='utf-8') as file:
                file.write("\n\n.tool-title {\n    font-size: 1.5rem;\n    color: var(--white);\n    margin: 20px 0;\n    text-align: center;\n}\n")
            print(f"Added tool-title with margin to {styles_css_path}")
            return True
    else:
        # Create styles.css with tool-title class
        with open(styles_css_path, 'w', encoding='utf-8') as file:
            file.write("/* Tool-specific styles */\n\n.tool-title {\n    font-size: 1.5rem;\n    color: var(--white);\n    margin: 20px 0;\n    text-align: center;\n}\n")
        print(f"Created styles.css with tool-title margin in {styles_css_path}")
        return True

def main():
    # Get all tool directories
    tools_dir = "tools"
    tool_dirs = [os.path.join(tools_dir, d) for d in os.listdir(tools_dir) if os.path.isdir(os.path.join(tools_dir, d))]

    css_updates = 0
    css_created = 0

    # Update each tool's index.html and CSS files
    for tool_dir in tool_dirs:
        # Update index.html
        index_path = os.path.join(tool_dir, "index.html")
        if os.path.exists(index_path):
            update_html_file(index_path)

        # Update CSS files
        css_dir = os.path.join(tool_dir, "assets", "css")
        css_updated = False

        if os.path.exists(css_dir):
            for css_file in os.listdir(css_dir):
                if css_file.endswith('.css'):
                    css_path = os.path.join(css_dir, css_file)
                    if update_css_file(css_path):
                        css_updates += 1
                        css_updated = True

        # If no CSS file was updated, create or update one
        if not css_updated:
            if create_tool_title_css(tool_dir):
                css_created += 1

    print(f"Updated tool-title margin in {css_updates} CSS files")
    print(f"Created tool-title CSS in {css_created} files")

if __name__ == "__main__":
    main()

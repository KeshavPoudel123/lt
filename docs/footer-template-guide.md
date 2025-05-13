# Footer Template Integration Guide

This guide explains how to use the footer template system to ensure consistent footers across all pages of the website.

## Overview

The footer template system consists of:
1. A central HTML template file (`includes/footer.html`)
2. A JavaScript loader (`assets/js/footer-template.js`)
3. CSS styling in the main stylesheet

This system allows you to:
- Make changes to the footer in one place and have them apply to all pages
- Automatically handle relative paths for links in the footer
- Maintain consistent styling across all pages

## How to Use the Footer Template

### 1. Add the Footer Element

In your HTML file, add a simple footer element with the appropriate class:

```html
<!-- Footer -->
<footer class="footer">
    <!-- The content will be replaced by the template -->
</footer>
```

For tool pages, you can use:

```html
<!-- Footer -->
<footer class="tool-footer">
    <!-- The content will be replaced by the template -->
</footer>
```

### 2. Include the Footer Template Script

Add the following script tag before the closing `</body>` tag:

```html
<!-- Footer Template -->
<script src="../../assets/js/footer-template.js"></script>
```

Adjust the path as needed based on your file's location:
- For root-level pages: `assets/js/footer-template.js`
- For first-level tool pages: `../assets/js/footer-template.js`
- For second-level tool pages: `../../assets/js/footer-template.js`

### 3. That's it!

The script will:
1. Automatically determine the correct relative path to the root
2. Load the footer template from `includes/footer.html`
3. Replace the footer element with the template content
4. Replace `{{root_path}}` placeholders with the correct relative path

## Updating the Footer

To update the footer across all pages:

1. Edit the `includes/footer.html` file
2. Make your changes
3. Save the file

All pages that use the footer template will automatically show the updated footer when they are loaded.

## Troubleshooting

### Footer Not Loading

If the footer isn't loading correctly:

1. Check the browser console for errors
2. Verify that the path to `footer-template.js` is correct
3. Make sure you have a footer element with class `footer` or `tool-footer`
4. Check that the path to `includes/footer.html` is accessible

### Links Not Working

If links in the footer aren't working:

1. Make sure all links in `includes/footer.html` use the `{{root_path}}` placeholder
2. Example: `<a href="{{root_path}}tools/popular-tools/index.html">Popular Tools</a>`

## Example Implementation

Here's a complete example of how to implement the footer template in a tool page:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tool Name - Latest Online Tools</title>
    
    <!-- CSS -->
    <link rel="stylesheet" href="../../assets/css/styles.css">
    <!-- Other head content -->
</head>
<body>
    <!-- Page content -->
    
    <!-- Footer -->
    <footer class="footer">
        <!-- Content will be replaced by template -->
    </footer>
    
    <!-- Scripts -->
    <script src="../../assets/js/main.js"></script>
    <script src="../../assets/js/footer-template.js"></script>
</body>
</html>
```

## Advanced: Custom Footer Classes

If you need to add custom classes to the footer, you can do so in your HTML:

```html
<footer class="footer custom-footer-class">
    <!-- Content will be replaced, but the custom-footer-class will be preserved -->
</footer>
```

The template loader will preserve any additional classes you add to the footer element.

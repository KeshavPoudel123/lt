/**
 * ScribbleSpaceY - Markdown Module
 * Handles markdown parsing and rendering
 * Developed by Keshav Poudel
 */

const MarkdownManager = (function() {
    /**
     * Initialize the markdown parser
     */
    function init() {
        // Configure marked.js
        if (window.marked) {
            marked.setOptions({
                breaks: true,
                gfm: true,
                headerIds: true,
                highlight: function(code, lang) {
                    if (window.hljs && lang && hljs.getLanguage(lang)) {
                        try {
                            return hljs.highlight(code, { language: lang }).value;
                        } catch (e) {
                            console.error('Error highlighting code:', e);
                        }
                    }
                    return code;
                }
            });
        }
    }

    /**
     * Convert markdown to HTML
     * @param {string} markdown - Markdown text
     * @returns {string} HTML
     */
    function markdownToHtml(markdown) {
        if (!markdown) return '';
        
        try {
            if (window.marked) {
                return marked.parse(markdown);
            } else {
                console.warn('Marked.js not loaded');
                return convertSimpleMarkdown(markdown);
            }
        } catch (error) {
            console.error('Error parsing markdown:', error);
            return convertSimpleMarkdown(markdown);
        }
    }

    /**
     * Simple markdown converter (fallback if marked.js fails)
     * @param {string} markdown - Markdown text
     * @returns {string} HTML
     */
    function convertSimpleMarkdown(markdown) {
        if (!markdown) return '';
        
        let html = markdown;
        
        // Headers
        html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
        html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
        html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
        
        // Bold
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
        
        // Italic
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/_(.*?)_/g, '<em>$1</em>');
        
        // Links
        html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
        
        // Images
        html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">');
        
        // Code blocks
        html = html.replace(/```(.*?)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
        
        // Inline code
        html = html.replace(/`(.*?)`/g, '<code>$1</code>');
        
        // Lists
        html = html.replace(/^\* (.*?)$/gm, '<li>$1</li>');
        html = html.replace(/^- (.*?)$/gm, '<li>$1</li>');
        html = html.replace(/^(\d+)\. (.*?)$/gm, '<li>$2</li>');
        
        // Paragraphs
        html = html.replace(/^(?!<[a-z])(.*?)$/gm, '<p>$1</p>');
        
        // Clean up empty paragraphs
        html = html.replace(/<p><\/p>/g, '');
        
        return html;
    }

    /**
     * Convert HTML to markdown
     * @param {string} html - HTML content
     * @returns {string} Markdown
     */
    function htmlToMarkdown(html) {
        if (!html) return '';
        
        // Create a temporary element to work with the HTML
        const temp = document.createElement('div');
        temp.innerHTML = html;
        
        // Process the DOM and convert to markdown
        return processNodeToMarkdown(temp);
    }

    /**
     * Process a DOM node and its children to markdown
     * @param {Node} node - DOM node
     * @returns {string} Markdown
     */
    function processNodeToMarkdown(node) {
        let markdown = '';
        
        // Process each child node
        for (let i = 0; i < node.childNodes.length; i++) {
            const child = node.childNodes[i];
            
            if (child.nodeType === Node.TEXT_NODE) {
                markdown += child.textContent;
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                const tagName = child.tagName.toLowerCase();
                
                switch (tagName) {
                    case 'h1':
                        markdown += '# ' + processNodeToMarkdown(child) + '\n\n';
                        break;
                    case 'h2':
                        markdown += '## ' + processNodeToMarkdown(child) + '\n\n';
                        break;
                    case 'h3':
                        markdown += '### ' + processNodeToMarkdown(child) + '\n\n';
                        break;
                    case 'h4':
                        markdown += '#### ' + processNodeToMarkdown(child) + '\n\n';
                        break;
                    case 'h5':
                        markdown += '##### ' + processNodeToMarkdown(child) + '\n\n';
                        break;
                    case 'h6':
                        markdown += '###### ' + processNodeToMarkdown(child) + '\n\n';
                        break;
                    case 'p':
                        markdown += processNodeToMarkdown(child) + '\n\n';
                        break;
                    case 'strong':
                    case 'b':
                        markdown += '**' + processNodeToMarkdown(child) + '**';
                        break;
                    case 'em':
                    case 'i':
                        markdown += '*' + processNodeToMarkdown(child) + '*';
                        break;
                    case 'a':
                        const href = child.getAttribute('href') || '';
                        markdown += '[' + processNodeToMarkdown(child) + '](' + href + ')';
                        break;
                    case 'img':
                        const src = child.getAttribute('src') || '';
                        const alt = child.getAttribute('alt') || '';
                        markdown += '![' + alt + '](' + src + ')';
                        break;
                    case 'code':
                        if (child.parentNode.tagName.toLowerCase() === 'pre') {
                            // Code block
                            const className = child.getAttribute('class') || '';
                            const language = className.replace('language-', '');
                            markdown += '```' + language + '\n' + child.textContent + '\n```\n\n';
                        } else {
                            // Inline code
                            markdown += '`' + child.textContent + '`';
                        }
                        break;
                    case 'pre':
                        // Skip pre tags as they are handled by code tags
                        if (child.firstChild && child.firstChild.tagName && child.firstChild.tagName.toLowerCase() === 'code') {
                            markdown += processNodeToMarkdown(child);
                        } else {
                            markdown += '```\n' + child.textContent + '\n```\n\n';
                        }
                        break;
                    case 'ul':
                        markdown += processListToMarkdown(child, '*') + '\n';
                        break;
                    case 'ol':
                        markdown += processListToMarkdown(child, '1.') + '\n';
                        break;
                    case 'li':
                        // Skip li tags as they are handled by ul/ol
                        markdown += processNodeToMarkdown(child);
                        break;
                    case 'blockquote':
                        markdown += '> ' + processNodeToMarkdown(child).replace(/\n/g, '\n> ') + '\n\n';
                        break;
                    case 'hr':
                        markdown += '---\n\n';
                        break;
                    case 'br':
                        markdown += '\n';
                        break;
                    default:
                        markdown += processNodeToMarkdown(child);
                }
            }
        }
        
        return markdown;
    }

    /**
     * Process a list node to markdown
     * @param {Node} listNode - List DOM node
     * @param {string} marker - List marker (* or 1.)
     * @returns {string} Markdown
     */
    function processListToMarkdown(listNode, marker) {
        let markdown = '';
        let counter = 1;
        
        for (let i = 0; i < listNode.childNodes.length; i++) {
            const child = listNode.childNodes[i];
            
            if (child.nodeType === Node.ELEMENT_NODE && child.tagName.toLowerCase() === 'li') {
                const itemMarker = marker === '1.' ? counter + '.' : marker;
                markdown += itemMarker + ' ' + processNodeToMarkdown(child).trim() + '\n';
                counter++;
            }
        }
        
        return markdown;
    }

    /**
     * Detect code blocks in text and apply syntax highlighting
     * @param {string} text - Text to process
     * @returns {string} Processed text with syntax highlighting
     */
    function highlightCodeBlocks(text) {
        if (!text) return '';
        
        // Skip if highlight.js is not available
        if (!window.hljs) {
            return text;
        }
        
        // Find code blocks (```language\ncode```)
        return text.replace(/```(\w+)?\n([\s\S]*?)```/g, function(match, language, code) {
            if (language && hljs.getLanguage(language)) {
                try {
                    return '<pre><code class="hljs language-' + language + '">' + 
                           hljs.highlight(code, { language: language }).value + 
                           '</code></pre>';
                } catch (e) {
                    console.error('Error highlighting code:', e);
                }
            }
            
            // Fallback to auto-detection or plain text
            try {
                return '<pre><code class="hljs">' + 
                       hljs.highlightAuto(code).value + 
                       '</code></pre>';
            } catch (e) {
                console.error('Error auto-highlighting code:', e);
                return '<pre><code class="hljs">' + code + '</code></pre>';
            }
        });
    }

    /**
     * Get a list of supported languages for syntax highlighting
     * @returns {Array} List of language names
     */
    function getSupportedLanguages() {
        if (!window.hljs) {
            return [];
        }
        
        return Object.keys(hljs.listLanguages());
    }

    // Public API
    return {
        init,
        markdownToHtml,
        htmlToMarkdown,
        highlightCodeBlocks,
        getSupportedLanguages
    };
})();

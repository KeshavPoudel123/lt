/**
 * SQL Formatter Tool
 * 
 * This tool allows users to format and beautify SQL queries for better readability.
 * It supports various SQL dialects including MySQL, PostgreSQL, SQL Server, and more.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the SQL formatter
    initSqlFormatter();
});

/**
 * Show notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type ('success', 'error', 'info')
 */
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    
    // Reset classes
    notification.classList.remove('success', 'error', 'info');
    
    // Add appropriate class based on type
    notification.classList.add(type);
    
    // Set message
    notificationMessage.textContent = message;
    
    // Show notification
    notification.classList.add('show');
    
    // Hide after delay
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

/**
 * Initialize the SQL formatter
 */
function initSqlFormatter() {
    // DOM elements
    const inputSql = document.getElementById('input-sql');
    const outputSql = document.getElementById('output-sql');
    const formatBtn = document.getElementById('format-btn');
    const pasteBtn = document.getElementById('paste-btn');
    const clearBtn = document.getElementById('clear-btn');
    const sampleBtn = document.getElementById('sample-btn');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');
    
    // Options elements
    const sqlDialect = document.getElementById('sql-dialect');
    const indentSize = document.getElementById('indent-size');
    const uppercaseKeywords = document.getElementById('uppercase-keywords');
    const lineBetweenQueries = document.getElementById('line-between-queries');
    const wrapLongLines = document.getElementById('wrap-long-lines');
    
    // Event listeners
    formatBtn.addEventListener('click', formatSql);
    pasteBtn.addEventListener('click', pasteSql);
    clearBtn.addEventListener('click', clearSql);
    sampleBtn.addEventListener('click', loadSampleSql);
    copyBtn.addEventListener('click', copySql);
    downloadBtn.addEventListener('click', downloadSql);
    
    // Initial sample SQL
    loadSampleSql();
    
    /**
     * Format SQL
     */
    function formatSql() {
        const sql = inputSql.value;
        
        if (!sql) {
            showNotification('Please enter SQL to format', 'error');
            return;
        }
        
        try {
            // Get formatting options
            const options = {
                language: sqlDialect.value,
                indent: indentSize.value === 'tab' ? '\t' : ' '.repeat(parseInt(indentSize.value)),
                uppercase: uppercaseKeywords.checked,
                linesBetweenQueries: lineBetweenQueries.checked ? 2 : 1,
                maxColumnLength: wrapLongLines.checked ? 80 : null
            };
            
            let formatted = sql;
            
            // Check if the SQL Formatter library is available
            if (typeof sqlFormatter !== 'undefined' && typeof sqlFormatter.format === 'function') {
                // Use the SQL Formatter library
                formatted = sqlFormatter.format(sql, options);
            } else {
                // Fallback to basic formatting
                console.warn('SQL Formatter library not available, using fallback formatting');
                
                // Basic formatting
                formatted = basicSqlFormat(sql, options);
            }
            
            // Update output
            outputSql.textContent = formatted;
            
            // Apply syntax highlighting
            hljs.highlightElement(outputSql);
            
            showNotification('SQL formatted successfully', 'success');
        } catch (error) {
            console.error('Error formatting SQL:', error);
            showNotification('Error formatting SQL: ' + error.message, 'error');
            
            // In case of error, just copy the input to output
            outputSql.textContent = sql;
        }
    }
    
    /**
     * Basic SQL formatting function as fallback
     * @param {string} sql - SQL to format
     * @param {object} options - Formatting options
     * @returns {string} - Formatted SQL
     */
    function basicSqlFormat(sql, options) {
        // Split SQL into statements
        const statements = sql.split(';');
        
        // Format each statement
        const formattedStatements = statements.map(statement => {
            if (!statement.trim()) return '';
            
            // Convert keywords to uppercase if needed
            let formatted = statement;
            if (options.uppercase) {
                const keywords = [
                    'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'FULL',
                    'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'ALL',
                    'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'TABLE', 'VIEW',
                    'INDEX', 'TRIGGER', 'PROCEDURE', 'FUNCTION', 'DATABASE', 'SCHEMA', 'GRANT',
                    'REVOKE', 'COMMIT', 'ROLLBACK', 'BEGIN', 'TRANSACTION', 'AS', 'AND', 'OR',
                    'NOT', 'IN', 'BETWEEN', 'LIKE', 'IS', 'NULL', 'TRUE', 'FALSE', 'CASE',
                    'WHEN', 'THEN', 'ELSE', 'END', 'EXISTS', 'DISTINCT', 'INTO', 'VALUES'
                ];
                
                keywords.forEach(keyword => {
                    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
                    formatted = formatted.replace(regex, keyword);
                });
            }
            
            // Add indentation
            formatted = formatted
                .replace(/\s+/g, ' ')
                .replace(/\s*,\s*/g, ', ')
                .replace(/\(\s+/g, '(')
                .replace(/\s+\)/g, ')')
                .replace(/\s*=\s*/g, ' = ')
                .replace(/\s*>\s*/g, ' > ')
                .replace(/\s*<\s*/g, ' < ')
                .replace(/\s*<>\s*/g, ' <> ')
                .replace(/\s*!=\s*/g, ' != ')
                .replace(/\s*>=\s*/g, ' >= ')
                .replace(/\s*<=\s*/g, ' <= ')
                .trim();
            
            // Add line breaks and indentation for common SQL clauses
            const indent = options.indent;
            formatted = formatted
                .replace(/\bSELECT\b/gi, 'SELECT\n' + indent)
                .replace(/\bFROM\b/gi, '\nFROM\n' + indent)
                .replace(/\bWHERE\b/gi, '\nWHERE\n' + indent)
                .replace(/\bGROUP BY\b/gi, '\nGROUP BY\n' + indent)
                .replace(/\bHAVING\b/gi, '\nHAVING\n' + indent)
                .replace(/\bORDER BY\b/gi, '\nORDER BY\n' + indent)
                .replace(/\bLIMIT\b/gi, '\nLIMIT\n' + indent)
                .replace(/\bJOIN\b/gi, '\nJOIN\n' + indent)
                .replace(/\bLEFT JOIN\b/gi, '\nLEFT JOIN\n' + indent)
                .replace(/\bRIGHT JOIN\b/gi, '\nRIGHT JOIN\n' + indent)
                .replace(/\bINNER JOIN\b/gi, '\nINNER JOIN\n' + indent)
                .replace(/\bOUTER JOIN\b/gi, '\nOUTER JOIN\n' + indent)
                .replace(/\bFULL JOIN\b/gi, '\nFULL JOIN\n' + indent)
                .replace(/\bUNION\b/gi, '\n\nUNION\n\n')
                .replace(/\bUNION ALL\b/gi, '\n\nUNION ALL\n\n')
                .replace(/\bCASE\b/gi, '\nCASE')
                .replace(/\bWHEN\b/gi, '\n' + indent + 'WHEN')
                .replace(/\bTHEN\b/gi, ' THEN')
                .replace(/\bELSE\b/gi, '\n' + indent + 'ELSE')
                .replace(/\bEND\b/gi, '\nEND');
            
            return formatted;
        });
        
        // Join statements with semicolons and line breaks
        const lineBreaks = '\n'.repeat(options.linesBetweenQueries);
        return formattedStatements.filter(s => s.trim()).join(';' + lineBreaks) + ';';
    }
    
    /**
     * Paste SQL from clipboard
     */
    async function pasteSql() {
        try {
            const text = await navigator.clipboard.readText();
            inputSql.value = text;
            showNotification('SQL pasted from clipboard', 'success');
        } catch (err) {
            console.error('Failed to read clipboard: ', err);
            showNotification('Failed to paste from clipboard', 'error');
        }
    }
    
    /**
     * Clear SQL input
     */
    function clearSql() {
        inputSql.value = '';
        outputSql.textContent = '-- Formatted SQL will appear here';
        hljs.highlightElement(outputSql);
        showNotification('Input cleared', 'error');
    }
    
    /**
     * Copy formatted SQL to clipboard
     */
    function copySql() {
        const sql = outputSql.textContent;
        
        if (!sql || sql === '-- Formatted SQL will appear here') {
            showNotification('No formatted SQL to copy', 'error');
            return;
        }
        
        // Use the modern clipboard API if available
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(sql)
                .then(() => {
                    showNotification('SQL copied to clipboard', 'success');
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    // Fallback to the older method
                    fallbackCopyToClipboard(sql);
                });
        } else {
            // Fallback for browsers that don't support the Clipboard API
            fallbackCopyToClipboard(sql);
        }
    }
    
    /**
     * Fallback method to copy text to clipboard
     * @param {string} text - Text to copy
     */
    function fallbackCopyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';  // Prevent scrolling to bottom
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showNotification('SQL copied to clipboard', 'success');
            } else {
                showNotification('Failed to copy text', 'error');
            }
        } catch (err) {
            console.error('Failed to copy text: ', err);
            showNotification('Failed to copy text', 'error');
        }
        
        document.body.removeChild(textarea);
    }
    
    /**
     * Download formatted SQL as a file
     */
    function downloadSql() {
        const sql = outputSql.textContent;
        
        if (!sql || sql === '-- Formatted SQL will appear here') {
            showNotification('No formatted SQL to download', 'error');
            return;
        }
        
        const fileName = `formatted_sql_${new Date().getTime()}.sql`;
        const blob = new Blob([sql], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        
        URL.revokeObjectURL(url);
        
        showNotification(`Downloaded as ${fileName}`, 'success');
    }
    
    /**
     * Load sample SQL
     */
    function loadSampleSql() {
        // Get sample SQL based on selected dialect
        const dialect = sqlDialect.value;
        const sample = getSampleSql(dialect);
        
        inputSql.value = sample;
        showNotification(`Sample ${dialect.toUpperCase()} query loaded`, 'info');
    }
    
    /**
     * Get sample SQL for a specific dialect
     * @param {string} dialect - SQL dialect
     * @returns {string} - Sample SQL
     */
    function getSampleSql(dialect) {
        // Default sample (Standard SQL)
        let sample = `-- Sample SQL Query
SELECT 
    c.customer_id,
    c.first_name,
    c.last_name,
    c.email,
    COUNT(o.order_id) as total_orders,
    SUM(o.total_amount) as total_spent
FROM 
    customers c
LEFT JOIN 
    orders o ON c.customer_id = o.customer_id
WHERE 
    c.status = 'active'
    AND o.order_date >= '2023-01-01'
GROUP BY 
    c.customer_id,
    c.first_name,
    c.last_name,
    c.email
HAVING 
    COUNT(o.order_id) > 0
ORDER BY 
    total_spent DESC
LIMIT 10;`;
        
        // Dialect-specific samples
        switch (dialect) {
            case 'mysql':
                sample = `-- Sample MySQL Query
SELECT 
    c.customer_id,
    c.first_name,
    c.last_name,
    c.email,
    COUNT(o.order_id) as total_orders,
    SUM(o.total_amount) as total_spent
FROM 
    customers c
LEFT JOIN 
    orders o ON c.customer_id = o.customer_id
WHERE 
    c.status = 'active'
    AND o.order_date >= '2023-01-01'
GROUP BY 
    c.customer_id
HAVING 
    COUNT(o.order_id) > 0
ORDER BY 
    total_spent DESC
LIMIT 10;`;
                break;
                
            case 'postgresql':
                sample = `-- Sample PostgreSQL Query
SELECT 
    c.customer_id,
    c.first_name,
    c.last_name,
    c.email,
    COUNT(o.order_id) as total_orders,
    SUM(o.total_amount) as total_spent,
    ARRAY_AGG(o.order_id) as order_ids
FROM 
    customers c
LEFT JOIN 
    orders o ON c.customer_id = o.customer_id
WHERE 
    c.status = 'active'
    AND o.order_date >= '2023-01-01'
GROUP BY 
    c.customer_id,
    c.first_name,
    c.last_name,
    c.email
HAVING 
    COUNT(o.order_id) > 0
ORDER BY 
    total_spent DESC
LIMIT 10;`;
                break;
                
            case 'tsql':
                sample = `-- Sample SQL Server (T-SQL) Query
SELECT TOP 10
    c.customer_id,
    c.first_name,
    c.last_name,
    c.email,
    COUNT(o.order_id) as total_orders,
    SUM(o.total_amount) as total_spent
FROM 
    customers c
LEFT JOIN 
    orders o ON c.customer_id = o.customer_id
WHERE 
    c.status = 'active'
    AND o.order_date >= '2023-01-01'
GROUP BY 
    c.customer_id,
    c.first_name,
    c.last_name,
    c.email
HAVING 
    COUNT(o.order_id) > 0
ORDER BY 
    total_spent DESC;`;
                break;
                
            case 'plsql':
                sample = `-- Sample Oracle (PL/SQL) Query
SELECT 
    c.customer_id,
    c.first_name,
    c.last_name,
    c.email,
    COUNT(o.order_id) as total_orders,
    SUM(o.total_amount) as total_spent
FROM 
    customers c
LEFT JOIN 
    orders o ON c.customer_id = o.customer_id
WHERE 
    c.status = 'active'
    AND o.order_date >= TO_DATE('2023-01-01', 'YYYY-MM-DD')
GROUP BY 
    c.customer_id,
    c.first_name,
    c.last_name,
    c.email
HAVING 
    COUNT(o.order_id) > 0
ORDER BY 
    total_spent DESC
FETCH FIRST 10 ROWS ONLY;`;
                break;
        }
        
        return sample;
    }
}

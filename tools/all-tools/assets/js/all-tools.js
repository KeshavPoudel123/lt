// ===== ALL TOOLS PAGE SPECIFIC JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the all tools page
    initAllToolsPage();

    // Initialize Lottie animation
    initLottieAnimation();

    // Navigation menu toggle is now handled by main.js

    // Initialize search functionality
    initSearch();

    // Initialize view toggle
    initViewToggle();

    // Add window resize event listener to update grid layout
    window.addEventListener('resize', () => {
        // Only update if we're in grid view
        if (localStorage.getItem('toolsView') === 'grid') {
            // Use a debounce to avoid excessive updates
            // Define resizeTimeout as a property on window if it doesn't exist
            if (typeof window.resizeTimeout === 'undefined') {
                window.resizeTimeout = null;
            }

            if (window.resizeTimeout) {
                clearTimeout(window.resizeTimeout);
            }
            window.resizeTimeout = setTimeout(() => {
                updateGridLayout();
            }, 250);
        }
    });
});

/**
 * Initialize the all tools page
 */
function initAllToolsPage() {
    const allToolsGrid = document.getElementById('all-tools-grid');
    const toolsFilter = document.getElementById('tools-filter');
    const categoryFiltersContainer = document.querySelector('.category-filters');

    // Global variables to store tools data
    // Define properties on window object
    if (typeof window.allTools === 'undefined') {
        window.allTools = [];
    }
    if (typeof window.categories === 'undefined') {
        window.categories = [];
    }
    if (typeof window.filteredTools === 'undefined') {
        window.filteredTools = [];
    }
    if (typeof window.activeCategory === 'undefined') {
        window.activeCategory = 'all'; // Default to showing all categories
    }
    if (typeof window.activeView === 'undefined') {
        window.activeView = localStorage.getItem('toolsView') || 'grid'; // Default to grid view
    }

    // Use embedded data directly instead of fetching to avoid CORS issues

    // Define the embedded tools data
    const toolsData = {
        "categories": [
            {
                "name": "Text Tools",
                "icon": "text_format",
                "tools": [
                    {
                        "id": "online-notepad",
                        "name": "Online Notepad",
                        "description": "A simple, distraction-free online text editor for quick notes and writing.",
                        "icon": "edit_note",
                        "isNew": false,
                        "url": "../onlinenotepad/index.html"
                    },
                    {
                        "id": "word-counter",
                        "name": "Word Counter",
                        "description": "Count words, characters, and paragraphs in your text with detailed statistics.",
                        "icon": "format_list_numbered",
                        "isNew": false,
                        "url": "../word-counter/index.html"
                    },
                    {
                        "id": "text-diff-highlighter",
                        "name": "Text Diff Highlighter",
                        "description": "Compare two texts and highlight the differences between them.",
                        "icon": "compare_arrows",
                        "isNew": true,
                        "url": "../text-diff-highlighter/index.html"
                    },
                    {
                        "id": "markdown-editor",
                        "name": "Markdown Editor",
                        "description": "Write and preview Markdown with syntax highlighting and live preview.",
                        "icon": "code",
                        "isNew": true,
                        "url": "../markdown-editor/index.html"
                    },

                    {
                        "id": "text-case-converter",
                        "name": "Case Converter",
                        "description": "Convert text between different cases: uppercase, lowercase, title case, etc.",
                        "icon": "text_fields",
                        "isNew": true,
                        "url": "../text-case-converter/index.html"
                    },
                    {
                        "id": "lipsum-generator",
                        "name": "Lorem Ipsum Generator",
                        "description": "Generate Lorem Ipsum placeholder text for your designs, layouts, and mockups.",
                        "icon": "format_align_left",
                        "isNew": true,
                        "url": "../lipsum-generator/index.html"
                    },
                    {
                        "id": "convert-case",
                        "name": "Convert Case",
                        "description": "Transform text between various case formats including camelCase, PascalCase, snake_case, and more.",
                        "icon": "text_fields",
                        "isNew": true,
                        "url": "../convert-case/index.html"
                    }
                ]
            },
            {
                "name": "File Tools",
                "icon": "folder",
                "tools": [

                    {
                        "id": "file-compressor",
                        "name": "File Compressor",
                        "description": "Compress files to reduce size while maintaining quality.",
                        "icon": "compress",
                        "isNew": false,
                        "url": "../file-compressor/index.html"
                    },



                    {
                        "id": "pdf-converter",
                        "name": "PDF Converter",
                        "description": "Convert documents to and from PDF format with ease.",
                        "icon": "picture_as_pdf",
                        "isNew": true,
                        "url": "../pdf-converter/index.html"
                    }
                ]
            },
            {
                "name": "Image Tools",
                "icon": "image",
                "tools": [
                    {
                        "id": "image-resizer",
                        "name": "Image Resizer",
                        "description": "Resize, crop, and optimize images for web or print.",
                        "icon": "crop",
                        "isNew": true,
                        "url": "../img-resizer/index.html"
                    },
                    {
                        "id": "meme-generator",
                        "name": "Meme Generator",
                        "description": "Create custom memes with your own images and text.",
                        "icon": "sentiment_very_satisfied",
                        "isNew": true,
                        "url": "../meme-generator/index.html"
                    },
                    {
                        "id": "image-editor",
                        "name": "Image Editor",
                        "description": "Edit images with filters, effects, and adjustments in your browser.",
                        "icon": "photo_filter",
                        "isNew": false,
                        "url": "../image-editor/index.html"
                    },
                    {
                        "id": "image-converter",
                        "name": "Image Converter",
                        "description": "Convert images between formats like JPG, PNG, WebP, and more.",
                        "icon": "swap_horiz",
                        "isNew": false,
                        "url": "../image-converter/index.html"
                    },
                    {
                        "id": "image-compressor",
                        "name": "Image Compressor",
                        "description": "Compress images to reduce file size while preserving quality.",
                        "icon": "compress",
                        "isNew": true,
                        "url": "../image-compressor/index.html"
                    },
                    {
                        "id": "background-remover",
                        "name": "Background Remover",
                        "description": "Remove backgrounds from images automatically with AI technology.",
                        "icon": "auto_fix_high",
                        "isNew": true,
                        "url": "../image-background-remover/index.html"
                    },

                    {
                        "id": "whiteboard",
                        "name": "WHiteboard",
                        "description": "Collaborative online whiteboard for drawing and brainstorming.",
                        "icon": "draw",
                        "isNew": true,
                        "url": "../witeboard/index.html"
                    }
                ]
            },
            {
                "name": "Developer Tools",
                "icon": "code",
                "tools": [
                    {
                        "id": "json-formatter",
                        "name": "JSON Formatter",
                        "description": "Format, validate, and beautify JSON data.",
                        "icon": "data_object",
                        "isNew": false,
                        "url": "../json-formatter/index.html"
                    },
                    {
                        "id": "regex-tester",
                        "name": "Regex Tester",
                        "description": "Test and debug regular expressions with real-time highlighting.",
                        "icon": "find_replace",
                        "isNew": false,
                        "url": "../regex-tester/index.html"
                    },
                    {
                        "id": "code-beautifier",
                        "name": "Code Beautifier",
                        "description": "Format and beautify code in various programming languages.",
                        "icon": "format_align_left",
                        "isNew": true,
                        "url": "../code-beautifier/index.html"
                    },
                    {
                        "id": "html-minifier",
                        "name": "HTML Minifier",
                        "description": "Minify HTML code to reduce file size and improve load times.",
                        "icon": "compress",
                        "isNew": false,
                        "url": "../html-minifier/index.html"
                    },
                    {
                        "id": "css-minifier",
                        "name": "CSS Minifier",
                        "description": "Minify CSS code to reduce file size and improve load times.",
                        "icon": "compress",
                        "isNew": false,
                        "url": "../css-minifier/index.html"
                    },
                    {
                        "id": "js-minifier",
                        "name": "JavaScript Minifier",
                        "description": "Minify JavaScript code to reduce file size and improve load times.",
                        "icon": "compress",
                        "isNew": false,
                        "url": "../js-minifier/index.html"
                    },
                    {
                        "id": "sql-formatter",
                        "name": "SQL Formatter",
                        "description": "Format and beautify SQL queries for better readability.",
                        "icon": "storage",
                        "isNew": true,
                        "url": "../sql-formatter/index.html"
                    },

                    {
                        "id": "json-reformatter",
                        "name": "JSON Reformatter",
                        "description": "Advanced JSON tool with validation, tree view, and conversion to other formats.",
                        "icon": "data_object",
                        "isNew": true,
                        "url": "../json-reformatter/index.html"
                    },

                    {
                        "id": "css-grid-generator",
                        "name": "CSS Grid Generator",
                        "description": "Create and customize CSS grid layouts with a visual editor.",
                        "icon": "grid_view",
                        "isNew": true,
                        "url": "../css-grid-generator/index.html"
                    },

                ]
            },
            {
                "name": "Productivity Tools",
                "icon": "schedule",
                "tools": [
                    {
                        "id": "pomodoro-timer",
                        "name": "Pomodoro Timer",
                        "description": "Boost productivity with timed work sessions and breaks.",
                        "icon": "timer",
                        "isNew": true,
                        "url": "../pomodoro-timer/index.html"
                    },
                    {
                        "id": "calendar-planner",
                        "name": "Calendar Planner",
                        "description": "Plan your schedule with an intuitive calendar interface.",
                        "icon": "calendar_today",
                        "isNew": false,
                        "url": "../calendar-planner/index.html"
                    },
                    {
                        "id": "todo-list",
                        "name": "Todo List",
                        "description": "Manage your tasks with a simple and effective todo list.",
                        "icon": "checklist",
                        "isNew": true,
                        "url": "../todo-list/index.html"
                    },

                    {
                        "id": "habit-tracker",
                        "name": "Habit Tracker",
                        "description": "Track and build habits with visual progress indicators.",
                        "icon": "trending_up",
                        "isNew": true,
                        "url": "../habit-tracker/index.html"
                    }
                ]
            },
            {
                "name": "Utility Tools",
                "icon": "build",
                "tools": [
                    {
                        "id": "password-generator",
                        "name": "Password Generator",
                        "description": "Generate strong, secure passwords with customizable options.",
                        "icon": "password",
                        "isNew": true,
                        "url": "../password-generator/index.html"
                    },
                    {
                        "id": "qr-code-generator",
                        "name": "QR Code Generator",
                        "description": "Create QR codes for URLs, text, contact info, and more.",
                        "icon": "qr_code",
                        "isNew": true,
                        "url": "../qr-generator/index.html"
                    },


                    {
                        "id": "unit-converter",
                        "name": "Unit Converter",
                        "description": "Convert between different units of measurement.",
                        "icon": "swap_vert",
                        "isNew": true,
                        "url": "../unit-converter/index.html"
                    },



                    {
                        "id": "password-checker",
                        "name": "Password Checker",
                        "description": "Check password strength and security with breach detection.",
                        "icon": "security",
                        "isNew": true,
                        "url": "../password-checker/index.html"
                    },





                    {
                        "id": "ascii-table",
                        "name": "ASCII Table",
                        "description": "Reference and search ASCII character codes and symbols.",
                        "icon": "table_chart",
                        "isNew": true,
                        "url": "../ascii-table/index.html"
                    },


                    {
                        "id": "date-duration-calculator",
                        "name": "Date Duration Calculator",
                        "description": "Calculate number of days, weeks, months between dates or add/subtract time from dates.",
                        "icon": "event",
                        "isNew": true,
                        "url": "../date-duration-calculator/index.html"
                    },

                ]
            },
            {
                "name": "Math Tools",
                "icon": "calculate",
                "tools": [






                    {
                        "id": "grade-calculator",
                        "name": "Grade Calculator",
                        "description": "Calculate final grades based on assignments, tests, and other assessable items.",
                        "icon": "school",
                        "isNew": true,
                        "url": "../grade-calculator/index.html"
                    },
                    {
                        "id": "gpa-calculator",
                        "name": "GPA Calculator",
                        "description": "Calculate your Grade Point Average (GPA) based on course grades and credit hours.",
                        "icon": "calculate",
                        "isNew": true,
                        "url": "../gpa-calculator/index.html"
                    }
                ]
            },
            {
                "name": "Financial Calculators",
                "icon": "attach_money",
                "tools": [
                    {
                        "id": "mortgage-calculator",
                        "name": "Mortgage Calculator",
                        "description": "Calculate mortgage payments, amortization schedules, and total costs.",
                        "icon": "home",
                        "isNew": true,
                        "url": "../mortgage-calculator/index.html"
                    },
                    {
                        "id": "compound-interest-calculator",
                        "name": "Compound Interest Calculator",
                        "description": "Calculate growth of investments with compound interest over time.",
                        "icon": "trending_up",
                        "isNew": true,
                        "url": "../compound-interest-calculator/index.html"
                    },

                ]
            },
            {
                "name": "Health Calculators",
                "icon": "favorite",
                "tools": [
                    {
                        "id": "bmi-calculator",
                        "name": "BMI Calculator",
                        "description": "Calculate Body Mass Index and provide health category information.",
                        "icon": "monitor_weight",
                        "isNew": true,
                        "url": "../bmi-calculator/index.html"
                    },

                ]
            }
        ]
    };

    // Process the embedded data
    window.categories = toolsData.categories;

    // Create a flat array of all tools with category information
    window.allTools = toolsData.categories.reduce((acc, category) => {
        return acc.concat(category.tools.map(tool => ({
            ...tool,
            category: category.name,
            categoryId: category.name.toLowerCase().replace(/\s+/g, '-'),
            categoryIcon: category.icon
        })));
    }, []);

    window.filteredTools = [...window.allTools];

    // Create category filters
    createCategoryFilters(window.categories, categoryFiltersContainer);

    // Render all tools
    renderTools(window.filteredTools, allToolsGrid);

    // Add event listeners for filtering
    addFilterEventListeners(toolsFilter, categoryFiltersContainer);
}

/**
 * Create category filter buttons
 * @param {Array} categories - Array of categories
 * @param {HTMLElement} container - Container element for filters
 */
function createCategoryFilters(categories, container) {
    // First, make sure the "All Categories" button is active by default
    const allCategoriesButton = container.querySelector('[data-category="all"]');
    if (allCategoriesButton) {
        allCategoriesButton.classList.add('active');
    }

    // Add category filter buttons
    categories.forEach(category => {
        const categoryId = category.name.toLowerCase().replace(/\s+/g, '-');
        const filterButton = document.createElement('button');
        filterButton.className = 'category-filter';
        filterButton.setAttribute('data-category', categoryId);
        filterButton.setAttribute('id', `category-filter-${categoryId}`);
        filterButton.innerHTML = `
            <span class="material-icons">${category.icon}</span>
            <span class="filter-text">${category.name}</span>
        `;
        container.appendChild(filterButton);
    });

    // Check if there's a hash in the URL and activate the corresponding category
    if (window.location.hash) {
        const categoryId = window.location.hash.substring(1);
        const categoryButton = container.querySelector(`[data-category="${categoryId}"]`);
        if (categoryButton) {
            // Remove active class from all buttons
            container.querySelectorAll('.category-filter').forEach(btn => {
                btn.classList.remove('active');
            });

            // Add active class to the matching button
            categoryButton.classList.add('active');

            // Update active category
            window.activeCategory = categoryId;

            // Filter tools
            setTimeout(() => {
                filterTools();

                // Scroll to the category section
                const categorySection = document.getElementById(categoryId);
                if (categorySection) {
                    categorySection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }
}

/**
 * Add event listeners for filtering tools
 * @param {HTMLElement} searchInput - Search input element
 * @param {HTMLElement} categoryFiltersContainer - Container for category filters
 */
function addFilterEventListeners(searchInput, categoryFiltersContainer) {
    // Search filter
    searchInput.addEventListener('input', filterTools);

    // Category filters
    const categoryFilters = categoryFiltersContainer.querySelectorAll('.category-filter');
    categoryFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            // Update active filter
            categoryFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');

            // Update active category
            window.activeCategory = filter.getAttribute('data-category');

            // Update URL hash
            const categoryId = filter.getAttribute('data-category');
            if (categoryId === 'all') {
                // Remove hash if "All Categories" is selected
                history.pushState("", document.title, window.location.pathname + window.location.search);
            } else {
                // Add hash for specific category
                window.location.hash = categoryId;
            }

            // Filter tools
            filterTools();

            // Scroll to the category section if it's not "all"
            if (categoryId !== 'all') {
                const categorySection = document.getElementById(categoryId);
                if (categorySection) {
                    categorySection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Add event listeners for footer category links
    document.querySelectorAll('.footer-col a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const categoryId = link.getAttribute('href').substring(1);
            const categoryButton = document.querySelector(`[data-category="${categoryId}"]`);

            if (categoryButton) {
                // Trigger a click on the category button
                categoryButton.click();
                e.preventDefault();
            }
        });
    });
}

/**
 * Filter tools based on search input and active category
 */
function filterTools() {
    const searchInput = document.getElementById('tools-filter');
    const allToolsGrid = document.getElementById('all-tools-grid');
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

    // Get the active category from the active filter button
    const activeFilterButton = document.querySelector('.category-filter.active');
    if (activeFilterButton) {
        window.activeCategory = activeFilterButton.getAttribute('data-category');
    } else {
        window.activeCategory = 'all'; // Default to all if no active button found
    }

    // Filter tools based on search term and active category
    window.filteredTools = window.allTools.filter(tool => {
        const matchesSearch =
            tool.name.toLowerCase().includes(searchTerm) ||
            tool.description.toLowerCase().includes(searchTerm);

        const matchesCategory =
            window.activeCategory === 'all' ||
            tool.categoryId === window.activeCategory;

        return matchesSearch && matchesCategory;
    });

    // Render filtered tools
    renderTools(window.filteredTools, allToolsGrid);
}

/**
 * Initialize view toggle functionality
 */
function initViewToggle() {
    const gridViewBtn = document.getElementById('grid-view-btn');
    const listViewBtn = document.getElementById('list-view-btn');
    const toolsContainer = document.getElementById('all-tools-grid');

    // Get saved view preference from localStorage
    const savedView = localStorage.getItem('toolsView') || 'grid';

    // Set initial active state based on saved preference
    if (savedView === 'grid') {
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        toolsContainer.className = 'all-tools-grid';
    } else {
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
        toolsContainer.className = 'all-tools-list';
    }

    // Add event listeners for view toggle buttons
    gridViewBtn.addEventListener('click', () => {
        if (!gridViewBtn.classList.contains('active')) {
            // Update active state
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');

            // Update container class immediately
            toolsContainer.className = 'all-tools-grid';

            // Save preference to localStorage
            localStorage.setItem('toolsView', 'grid');

            // Update the view without re-rendering
            updateViewWithoutRerender('grid');
        }
    });

    listViewBtn.addEventListener('click', () => {
        if (!listViewBtn.classList.contains('active')) {
            // Update active state
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');

            // Update container class immediately
            toolsContainer.className = 'all-tools-list';

            // Save preference to localStorage
            localStorage.setItem('toolsView', 'list');

            // Update the view without re-rendering
            updateViewWithoutRerender('list');
        }
    });
}

/**
 * Update view without re-rendering all tools
 */
function updateViewWithoutRerender() {
    // This approach doesn't work well - it's better to fully re-render
    // to ensure consistent card structure
    filterTools();
}

/**
 * Render tools in the grid or list view
 * @param {Array} tools - Array of tools to render
 * @param {HTMLElement} container - Container element for tools
 */
function renderTools(tools, container) {
    // Clear container with optimized method
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    if (tools.length === 0) {
        // Show no results message
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <span class="material-icons">search_off</span>
            <h3>No tools found</h3>
            <p>Try adjusting your search or filter criteria</p>
        `;
        container.appendChild(noResults);
        return;
    }

    // Get the active category from the active filter button
    const activeFilterButton = document.querySelector('.category-filter.active');
    if (activeFilterButton) {
        window.activeCategory = activeFilterButton.getAttribute('data-category');
    } else {
        window.activeCategory = 'all'; // Default to all if no active button found
    }

    // Get the current view mode - always use the localStorage value for consistency
    const viewMode = localStorage.getItem('toolsView') || 'grid';
    const isGridView = viewMode === 'grid';

    // Update container class based on view mode
    container.className = isGridView ? 'all-tools-grid' : 'all-tools-list';

    // Create document fragment for better performance
    const fragment = document.createDocumentFragment();

    if (window.activeCategory === 'all') {
        // Group tools by category
        const toolsByCategory = {};

        tools.forEach(tool => {
            if (!toolsByCategory[tool.category]) {
                toolsByCategory[tool.category] = {
                    name: tool.category,
                    icon: tool.categoryIcon,
                    id: tool.categoryId,
                    tools: []
                };
            }

            toolsByCategory[tool.category].tools.push(tool);
        });

        // Render tools by category
        Object.values(toolsByCategory).forEach(category => {
            // Create category section
            const categorySection = document.createElement('div');
            categorySection.className = 'category-section';
            categorySection.id = category.id;

            const categoryHeading = document.createElement('h2');
            categoryHeading.className = 'category-heading';
            categoryHeading.innerHTML = `
                <span class="material-icons">${category.icon}</span>
                ${category.name}
            `;
            categorySection.appendChild(categoryHeading);

            // Create tools container
            const toolsContainer = document.createElement('div');
            toolsContainer.className = isGridView ? 'category-tools grid-view' : 'category-tools list-view';

            if (isGridView) {
                toolsContainer.style.display = 'grid';

                // Use a smaller minimum width to ensure at least 2 columns on small screens
                const screenWidth = window.innerWidth;
                if (screenWidth <= 576) {
                    // For very small screens, force 2 columns
                    toolsContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
                    toolsContainer.style.gap = '8px';
                } else if (screenWidth <= 768) {
                    // For small screens, use smaller minimum width
                    toolsContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
                    toolsContainer.style.gap = 'var(--spacing-sm)';
                } else {
                    // For larger screens, use default
                    toolsContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
                    toolsContainer.style.gap = 'var(--spacing-md)';
                }
            } else {
                toolsContainer.style.display = 'flex';
                toolsContainer.style.flexDirection = 'column';
                toolsContainer.style.gap = 'var(--spacing-sm)';
            }

            // Add tools to container using fragment for better performance
            const toolsFragment = document.createDocumentFragment();
            category.tools.forEach(tool => {
                const toolItem = isGridView ? createToolCard(tool) : createToolListItem(tool);
                toolsFragment.appendChild(toolItem);
            });

            toolsContainer.appendChild(toolsFragment);
            categorySection.appendChild(toolsContainer);
            fragment.appendChild(categorySection);
        });
    } else {
        // Render tools without categories using fragment for better performance
        const toolsFragment = document.createDocumentFragment();
        tools.forEach(tool => {
            const toolItem = isGridView ? createToolCard(tool) : createToolListItem(tool);
            toolsFragment.appendChild(toolItem);
        });
        fragment.appendChild(toolsFragment);
    }

    // Append all content at once for better performance
    container.appendChild(fragment);
}

/**
 * Create a tool card element for grid view
 * @param {Object} tool - Tool data
 * @returns {HTMLElement} - Tool card element
 */
function createToolCard(tool) {
    const toolCard = document.createElement('div');
    toolCard.className = 'tool-card'; // Removed animate-on-scroll class
    toolCard.innerHTML = `
        <div class="tool-icon">
            <span class="material-icons">${tool.icon}</span>
        </div>
        <h3 class="tool-name">${tool.name}</h3>
        <span class="tool-category-badge">
            <span class="material-icons">${tool.categoryIcon}</span>
            ${tool.category}
        </span>
        <p class="tool-description">${tool.description}</p>
        <a href="${tool.url}" class="btn btn-primary">Launch</a>
        ${tool.isNew ? '<span class="tool-badge">New</span>' : ''}
    `;

    return toolCard;
}

/**
 * Create a tool list item element for list view
 * @param {Object} tool - Tool data
 * @returns {HTMLElement} - Tool list item element
 */
function createToolListItem(tool) {
    const toolListItem = document.createElement('div');
    toolListItem.className = 'tool-list-item'; // Removed animate-on-scroll class
    toolListItem.innerHTML = `
        <div class="tool-list-icon">
            <span class="material-icons">${tool.icon}</span>
        </div>
        <div class="tool-list-content">
            <div class="tool-list-header">
                <h3 class="tool-list-name">${tool.name}</h3>
                ${tool.isNew ? '<span class="tool-badge">New</span>' : ''}
            </div>
            <p class="tool-list-description">${tool.description}</p>
            <div class="tool-list-footer">
                <span class="tool-list-category">
                    <span class="material-icons">${tool.categoryIcon}</span>
                    ${tool.category}
                </span>
                <div class="tool-list-action">
                    <a href="${tool.url}" class="btn btn-primary">Launch</a>
                </div>
            </div>
        </div>
    `;

    return toolListItem;
}

/**
 * Update grid layout based on screen size
 */
function updateGridLayout() {
    // Get all category tools containers with grid view
    const gridContainers = document.querySelectorAll('.category-tools.grid-view');

    // Update each container's grid template columns based on screen width
    const screenWidth = window.innerWidth;
    gridContainers.forEach(container => {
        if (screenWidth <= 576) {
            // For very small screens, force 2 columns
            container.style.gridTemplateColumns = 'repeat(2, 1fr)';
            container.style.gap = '8px';
        } else if (screenWidth <= 768) {
            // For small screens, use smaller minimum width
            container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
            container.style.gap = 'var(--spacing-sm)';
        } else {
            // For larger screens, use default
            container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
            container.style.gap = 'var(--spacing-md)';
        }
    });
}

/**
 * Initialize Lottie animation
 */
function initLottieAnimation() {
    const lottieContainer = document.getElementById('all-tools-lottie');
    if (lottieContainer) {
        // Instead of loading an external JSON file, create a simple SVG animation
        const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
            <style>
                @keyframes rotate {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 1; }
                }
                .gear {
                    animation: rotate 10s linear infinite;
                    transform-origin: center;
                    fill: #5B4CC4;
                }
                .gear2 {
                    animation: rotate 8s linear infinite reverse;
                    transform-origin: center;
                    fill: #C12E61;
                }
                .pulse {
                    animation: pulse 3s ease-in-out infinite;
                }
            </style>
            <g class="pulse">
                <path class="gear" d="M100,30 L108,40 L120,38 L122,50 L135,55 L130,65 L140,75 L130,85 L135,95 L122,100 L120,112 L108,110 L100,120 L92,110 L80,112 L78,100 L65,95 L70,85 L60,75 L70,65 L65,55 L78,50 L80,38 L92,40 Z">
                </path>
                <circle class="gear" cx="100" cy="75" r="10"></circle>
            </g>
            <g class="pulse">
                <path class="gear2" d="M150,80 L158,90 L170,88 L172,100 L185,105 L180,115 L190,125 L180,135 L185,145 L172,150 L170,162 L158,160 L150,170 L142,160 L130,162 L128,150 L115,145 L120,135 L110,125 L120,115 L115,105 L128,100 L130,88 L142,90 Z">
                </path>
                <circle class="gear2" cx="150" cy="125" r="10"></circle>
            </g>
        </svg>
        `;

        lottieContainer.innerHTML = svgContent;
    }
}

// Navigation menu toggle function removed - now handled by main.js

/**
 * Initialize search functionality for the tools filter
 * Note: This is separate from the header search which is handled by main.js
 */
function initSearch() {
    // toolsFilter is not used in this function
    // const toolsFilter = document.getElementById('tools-filter');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const mobileSearchInput = document.getElementById('mobile-search-input');
    const mobileSearchButton = document.getElementById('mobile-search-button');

    // The tools filter input is handled by the filterTools function
    // We don't need to add any additional functionality here

    // Add functionality for the header search input and button
    if (searchInput && searchButton) {
        // Handle header search button click
        searchButton.addEventListener('click', () => {
            const searchTerm = searchInput.value.trim();
            if (searchTerm !== '') {
                window.location.href = `../search.html?q=${encodeURIComponent(searchTerm)}#search-results`;
            }
        });

        // Handle Enter key press in header search input
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const searchTerm = searchInput.value.trim();
                if (searchTerm !== '') {
                    window.location.href = `../search.html?q=${encodeURIComponent(searchTerm)}#search-results`;
                }
            }
        });
    }

    // Add functionality for the mobile search input and button
    if (mobileSearchInput && mobileSearchButton) {
        // Handle mobile search button click
        mobileSearchButton.addEventListener('click', () => {
            const searchTerm = mobileSearchInput.value.trim();
            if (searchTerm !== '') {
                window.location.href = `../search.html?q=${encodeURIComponent(searchTerm)}#search-results`;
            }
        });

        // Handle Enter key press in mobile search input
        mobileSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const searchTerm = mobileSearchInput.value.trim();
                if (searchTerm !== '') {
                    window.location.href = `../search.html?q=${encodeURIComponent(searchTerm)}#search-results`;
                }
            }
        });
    }
}


// Preloader removed for production

// ===== NAVIGATION MENU =====
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    // Header element is defined but not used
    // const header = document.querySelector('.header');
    const searchContainer = document.querySelector('.search-container');

    // Set active class on navigation menu items
    setActiveNavItem();

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.querySelector('.material-icons').textContent =
                navMenu.classList.contains('active') ? 'close' : 'menu';

            // Hide search container when menu is opened
            if (searchContainer && searchContainer.classList.contains('active')) {
                searchContainer.classList.remove('active');
            }
        });
    }

    // Function to set active class on navigation menu items based on current URL
    function setActiveNavItem() {
        try {
            const currentPath = window.location.pathname.toLowerCase();
            const navLinks = document.querySelectorAll('.nav-menu a');

            if (!navLinks || navLinks.length === 0) return;

            // First, remove active class from all nav links
            navLinks.forEach(link => {
                link.classList.remove('active');
            });

            // Set only one active link based on current path
            let activeSet = false;

            // Check if we're on the home page
            if (!currentPath.includes('/tools/') &&
                (currentPath.endsWith('index.html') ||
                 currentPath.endsWith('/') ||
                 currentPath.split('/').pop() === '')) {

                // Find the Home link
                const homeLink = document.querySelector('.nav-menu a[href="index.html"]');
                if (homeLink) {
                    homeLink.classList.add('active');
                    activeSet = true;
                }
            }
            // Check if we're on the popular tools page
            else if (currentPath.includes('/popular-tools/')) {
                // Find the Popular Tools link
                const popularToolsLink = document.querySelector('.nav-menu a[href*="popular-tools"]');
                if (popularToolsLink) {
                    popularToolsLink.classList.add('active');
                    activeSet = true;
                }
            }
            // Check if we're on the all tools page
            else if (currentPath.includes('/all-tools/')) {
                // Find the All Tools link
                const allToolsLink = document.querySelector('.nav-menu a[href*="all-tools"]');
                if (allToolsLink) {
                    allToolsLink.classList.add('active');
                    activeSet = true;
                }
            }

            // If no active link was set, try a position-based approach as a last resort
            if (!activeSet) {
                if (currentPath.includes('/popular-tools/')) {
                    // Popular Tools is typically the second item
                    const navItems = document.querySelectorAll('.nav-menu li');
                    if (navItems && navItems.length > 1) {
                        const link = navItems[1].querySelector('a');
                        if (link) {
                            link.classList.add('active');
                        }
                    }
                } else if (currentPath.includes('/all-tools/')) {
                    // All Tools is typically the third item
                    const navItems = document.querySelectorAll('.nav-menu li');
                    if (navItems && navItems.length > 2) {
                        const link = navItems[2].querySelector('a');
                        if (link) {
                            link.classList.add('active');
                        }
                    }
                } else if (!currentPath.includes('/tools/')) {
                    // Home is typically the first item
                    const navItems = document.querySelectorAll('.nav-menu li');
                    if (navItems && navItems.length > 0) {
                        const link = navItems[0].querySelector('a');
                        if (link) {
                            link.classList.add('active');
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error setting active nav item:', error);
        }
    }

    // Handle mobile search button click
    const mobileSearchBtn = document.querySelector('.mobile-search-btn');
    if (mobileSearchBtn && searchContainer) {
        mobileSearchBtn.addEventListener('click', () => {
            searchContainer.classList.toggle('active');

            // Hide nav menu when search is opened
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (navToggle) {
                    navToggle.querySelector('.material-icons').textContent = 'menu';
                }
            }
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && !e.target.closest('.nav') && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (navToggle) {
                navToggle.querySelector('.material-icons').textContent = 'menu';
            }
        }

        // Close search container when clicking outside
        if (searchContainer &&
            searchContainer.classList.contains('active') &&
            !e.target.closest('.search-container') &&
            !e.target.closest('.mobile-search-btn')) {
            searchContainer.classList.remove('active');
        }
    });
});

// ===== SCROLL ANIMATIONS =====
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    const animateOnScroll = () => {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight * 0.9) {
                element.classList.add('visible');
            }
        });
    };

    // Initial check
    animateOnScroll();

    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);
});

// ===== CUSTOM CURSOR =====
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.custom-cursor');

    // Only enable custom cursor on desktop
    if (window.innerWidth > 768) {
        cursor.style.display = 'block';

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });

        // Cursor effects on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, input, .tool-card, .blog-card');

        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.width = '40px';
                cursor.style.height = '40px';
                cursor.style.background = 'rgba(193, 46, 97, 0.3)';
            });

            element.addEventListener('mouseleave', () => {
                cursor.style.width = '20px';
                cursor.style.height = '20px';
                cursor.style.background = 'rgba(91, 76, 196, 0.3)';
            });
        });
    }
});

// ===== SEARCH FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-container .search-box input');
    const searchResults = document.querySelector('.search-results');
    const searchBtn = document.querySelector('.search-container .search-btn');
    const floatingSearchBtn = document.querySelector('.floating-search-btn');

    if (!searchInput || !searchResults) return;

    // Determine if we're on the home page or a tool page
    const isHomePage = !window.location.pathname.includes('/tools/') &&
                       (window.location.pathname.endsWith('index.html') ||
                        window.location.pathname.endsWith('/') ||
                        window.location.pathname.split('/').pop() === '');

    // Determine if we're on a page in the tools directory
    const isToolsPage = window.location.pathname.includes('/tools/');

    // Determine if we're on a special page (popular-tools, all-tools)
    const isSpecialPage = window.location.pathname.includes('/popular-tools/') ||
                          window.location.pathname.includes('/all-tools/');

    // Path is defined but not used directly
    // const toolsJsonPath = isHomePage ? 'data/tools.json' : '../data/tools.json';

    // Global variable to store all tools data
    let allTools = [];

    // Embedded tools data to avoid CORS issues with local file access
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
                        "url": "tools/onlinenotepad/index.html"
                    },
                    {
                        "id": "word-counter",
                        "name": "Word Counter",
                        "description": "Count words, characters, and paragraphs in your text with detailed statistics.",
                        "icon": "format_list_numbered",
                        "isNew": false,
                        "url": "tools/word-counter/index.html"
                    },
                    {
                        "id": "markdown-editor",
                        "name": "Markdown Editor",
                        "description": "Write and preview Markdown with syntax highlighting and live preview.",
                        "icon": "code",
                        "isNew": true,
                        "url": "tools/markdown-editor/index.html"
                    },
                    {
                        "id": "lipsum-generator",
                        "name": "Lorem Ipsum Generator",
                        "description": "Generate Lorem Ipsum placeholder text for your designs, layouts, and mockups.",
                        "icon": "format_align_left",
                        "isNew": true,
                        "url": "tools/lipsum-generator/index.html"
                    },
                    {
                        "id": "text-diff-checkerer",
                        "name": "Text Differences Checker",
                        "description": "Advanced text comparison tool with word-by-word highlighting.",
                        "icon": "compare",
                        "isNew": true,
                        "url": "tools/text-diff-highlighter/index.html"
                    },
                    {
                        "id": "text-case-converter",
                        "name": "Case Converter",
                        "description": "Convert text between different cases: uppercase, lowercase, title case, etc.",
                        "icon": "text_fields",
                        "isNew": true,
                        "url": "tools/text-case-converter/index.html"
                    },
                    {
                        "id": "convert-case",
                        "name": "Convert Case",
                        "description": "Transform text between various case formats including camelCase, PascalCase, snake_case, and more.",
                        "icon": "text_fields",
                        "isNew": true,
                        "url": "tools/convert-case/index.html"
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
                        "url": "tools/json-formatter/index.html"
                    },
                    {
                        "id": "regex-tester",
                        "name": "Regex Tester",
                        "description": "Test and debug regular expressions with real-time highlighting.",
                        "icon": "find_replace",
                        "isNew": false,
                        "url": "tools/regex-tester/index.html"
                    },
                    {
                        "id": "css-grid-generator",
                        "name": "CSS Grid Generator",
                        "description": "Create and customize CSS grid layouts with a visual editor.",
                        "icon": "grid_view",
                        "isNew": true,
                        "url": "tools/css-grid-generator/index.html"
                    },
                    {
                        "id": "json-reformatter",
                        "name": "JSON Reformatter",
                        "description": "Advanced JSON tool with validation, tree view, and conversion to other formats.",
                        "icon": "data_object",
                        "isNew": true,
                        "url": "tools/json-reformatter/index.html"
                    },
                    {
                        "id": "code-beautifier",
                        "name": "Code Beautifier",
                        "description": "Format and beautify code in various programming languages.",
                        "icon": "format_align_left",
                        "isNew": true,
                        "url": "tools/code-beautifier/index.html"
                    },
                    {
                        "id": "html-minifier",
                        "name": "HTML Minifier",
                        "description": "Minify HTML code to reduce file size and improve load times.",
                        "icon": "compress",
                        "isNew": true,
                        "url": "tools/html-minifier/index.html"
                    },
                    {
                        "id": "css-minifier",
                        "name": "CSS Minifier",
                        "description": "Minify CSS code to reduce file size and improve load times.",
                        "icon": "compress",
                        "isNew": true,
                        "url": "tools/css-minifier/index.html"
                    },
                    {
                        "id": "js-minifier",
                        "name": "JavaScript Minifier",
                        "description": "Minify JavaScript code to reduce file size and improve load times.",
                        "icon": "compress",
                        "isNew": true,
                        "url": "tools/js-minifier/index.html"
                    },
                    {
                        "id": "sql-formatter",
                        "name": "SQL Formatter",
                        "description": "Format and beautify SQL queries for better readability.",
                        "icon": "storage",
                        "isNew": true,
                        "url": "tools/sql-formatter/index.html"
                    },


                ]
            },
            {
                "name": "Utility Tools",
                "icon": "build",
                "tools": [
                    {
                        "id": "qr-generator",
                        "name": "QR Code Generator",
                        "description": "Create QR codes for URLs, text, contact info, and more.",
                        "icon": "qr_code",
                        "isNew": true,
                        "url": "tools/qr-generator/index.html"
                    },
                    {
                        "id": "unit-converter",
                        "name": "Unit Converter",
                        "description": "Convert between different units of measurement.",
                        "icon": "swap_vert",
                        "isNew": true,
                        "url": "tools/unit-converter/index.html"
                    },
                    {
                        "id": "password-generator",
                        "name": "Password Generator",
                        "description": "Generate strong, secure passwords with customizable options.",
                        "icon": "password",
                        "isNew": true,
                        "url": "tools/password-generator/index.html"
                    },
                    {
                        "id": "password-checker",
                        "name": "Password Checker",
                        "description": "Check password strength and security with breach detection.",
                        "icon": "security",
                        "isNew": true,
                        "url": "tools/password-checker/index.html"
                    },
                    {
                        "id": "ascii-table",
                        "name": "ASCII Table",
                        "description": "Reference and search ASCII character codes and symbols.",
                        "icon": "table_chart",
                        "isNew": true,
                        "url": "tools/ascii-table/index.html"
                    },

                    {
                        "id": "date-duration-calculator",
                        "name": "Date Duration Calculator",
                        "description": "Calculate number of days, weeks, months between dates or add/subtract time from dates.",
                        "icon": "event",
                        "isNew": true,
                        "url": "tools/date-duration-calculator/index.html"
                    },
                    {
                        "id": "whiteboard",
                        "name": "Whiteboard",
                        "description": "Collaborative online whiteboard for drawing and brainstorming.",
                        "icon": "draw",
                        "isNew": true,
                        "url": "tools/witeboard/index.html"
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
                        "url": "tools/grade-calculator/index.html"
                    },
                    {
                        "id": "gpa-calculator",
                        "name": "GPA Calculator",
                        "description": "Calculate your Grade Point Average (GPA) based on course grades and credit hours.",
                        "icon": "calculate",
                        "isNew": true,
                        "url": "tools/gpa-calculator/index.html"
                    },

                ]
            },
            {
                "name": "Image Tools",
                "icon": "image",
                "tools": [
                    {
                        "id": "img-resizer",
                        "name": "Image Resizer",
                        "description": "Resize, crop, and optimize images for web or print.",
                        "icon": "crop",
                        "isNew": true,
                        "url": "tools/img-resizer/index.html"
                    },
                    {
                        "id": "image-compressor",
                        "name": "Image Compressor",
                        "description": "Compress images to reduce file size while preserving quality.",
                        "icon": "compress",
                        "isNew": true,
                        "url": "tools/image-compressor/index.html"
                    },
                    {
                        "id": "image-converter",
                        "name": "Image Converter",
                        "description": "Convert images between formats like JPG, PNG, WebP, and more.",
                        "icon": "swap_horiz",
                        "isNew": true,
                        "url": "tools/image-converter/index.html"
                    },
                    {
                        "id": "image-editor",
                        "name": "Image Editor",
                        "description": "Edit images with filters, effects, and adjustments in your browser.",
                        "icon": "photo_filter",
                        "isNew": true,
                        "url": "tools/image-editor/index.html"
                    },
                    {
                        "id": "image-background-remover",
                        "name": "Background Remover",
                        "description": "Remove backgrounds from images automatically with AI technology.",
                        "icon": "auto_fix_high",
                        "isNew": true,
                        "url": "tools/image-background-remover/index.html"
                    },
                    {
                        "id": "meme-generator",
                        "name": "Meme Generator",
                        "description": "Create custom memes with your own images and text.",
                        "icon": "sentiment_very_satisfied",
                        "isNew": true,
                        "url": "tools/meme-generator/index.html"
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
                        "url": "tools/mortgage-calculator/index.html"
                    },
                    {
                        "id": "compound-interest-calculator",
                        "name": "Compound Interest Calculator",
                        "description": "Calculate growth of investments with compound interest over time.",
                        "icon": "trending_up",
                        "isNew": true,
                        "url": "tools/compound-interest-calculator/index.html"
                    }
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
                        "url": "tools/bmi-calculator/index.html"
                    }
                ]
            },
            {
                "name": "File Tools",
                "icon": "folder",
                "tools": [
                    {
                        "id": "pdf-converter",
                        "name": "PDF Converter",
                        "description": "Convert documents to and from PDF format with ease.",
                        "icon": "picture_as_pdf",
                        "isNew": true,
                        "url": "tools/pdf-converter/index.html"
                    },
                    {
                        "id": "file-compressor",
                        "name": "File Compressor",
                        "description": "Compress files to reduce size while maintaining quality.",
                        "icon": "compress",
                        "isNew": true,
                        "url": "tools/file-compressor/index.html"
                    }
                ]
            }
        ]
    };

    try {
        // Process the embedded data
        // Create a flat array of all tools with category information
        allTools = toolsData.categories.reduce((acc, category) => {
            return acc.concat(category.tools.map(tool => ({
                ...tool,
                category: category.name,
                categoryIcon: category.icon
            })));
        }, []);

        // Add event listeners for search
        if (searchInput) {
            searchInput.addEventListener('focus', () => {
                if (searchResults) {
                    searchResults.style.display = 'block';
                    if (searchInput.value.trim().length >= 2) {
                        performSearch(searchInput.value.trim());
                    }
                }
            });

            searchInput.addEventListener('blur', () => {
                // Delay hiding to allow for clicking on results
                if (searchResults) {
                    setTimeout(() => {
                        searchResults.style.display = 'none';
                    }, 200);
                }
            });

            searchInput.addEventListener('input', () => {
                const query = searchInput.value.toLowerCase().trim();
                performSearch(query);
            });

            // Add keyboard event for Enter key
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const query = searchInput.value.toLowerCase().trim();
                    if (query.length >= 2) {
                        // Redirect to search results page
                        const searchUrl = isHomePage
                            ? `tools/search.html?q=${encodeURIComponent(query)}#search-results`
                            : `../search.html?q=${encodeURIComponent(query)}#search-results`;
                        window.location.href = searchUrl;
                    } else if (searchResults) {
                        performSearch(query);
                        searchResults.style.display = 'block';
                    }
                }
            });
        }

        // Add search button click event
        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', () => {
                const query = searchInput.value.toLowerCase().trim();
                if (query.length >= 2) {
                    // Redirect to search results page
                    const searchUrl = isHomePage
                        ? `tools/search.html?q=${encodeURIComponent(query)}#search-results`
                        : `../search.html?q=${encodeURIComponent(query)}#search-results`;
                    window.location.href = searchUrl;
                } else if (searchResults) {
                    performSearch(query);
                    searchResults.style.display = 'block';
                }
            });
        }

        // Initialize related tools if we're on a tool page
        if (!isHomePage) {
            initRelatedTools();
        }
    } catch (error) {
        console.error('Error processing tools data for search:', error);
    }

    // Handle the floating search button if it exists
    if (floatingSearchBtn) {
        floatingSearchBtn.addEventListener('click', () => {
            // Get the search term from the search input if it has content
            const searchTerm = searchInput ? searchInput.value.trim() : '';

            // Determine the correct search URL based on whether we're on the home page or a tool page
            const searchUrl = isHomePage
                ? 'tools/search.html'
                : '../search.html';

            // If there's a search term, include it in the URL
            if (searchTerm !== '') {
                window.location.href = `${searchUrl}?q=${encodeURIComponent(searchTerm)}#search-results`;
            } else {
                window.location.href = searchUrl;
            }
        });
    }

    // Add functionality for the header search input and button
    if (searchInput && searchBtn) {
        // Handle header search button click
        searchBtn.addEventListener('click', () => {
            const searchTerm = searchInput.value.trim();
            if (searchTerm !== '') {
                // Determine the correct search URL based on whether we're on the home page or a tool page
                const searchUrl = isHomePage
                    ? 'tools/search.html'
                    : '../search.html';
                window.location.href = `${searchUrl}?q=${encodeURIComponent(searchTerm)}#search-results`;
            }
        });

        // Handle Enter key press in header search input
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const searchTerm = searchInput.value.trim();
                if (searchTerm !== '') {
                    // Determine the correct search URL based on whether we're on the home page or a tool page
                    const searchUrl = isHomePage
                        ? 'tools/search.html'
                        : '../search.html';
                    window.location.href = `${searchUrl}?q=${encodeURIComponent(searchTerm)}#search-results`;
                }
            }
        });
    }

    // Function to perform search
    function performSearch(query) {
        if (!searchResults) {
            console.error("Search results container not found");
            return;
        }

        if (!query || query.length < 2) {
            searchResults.innerHTML = '';
            searchResults.style.display = 'none';
            return;
        }

        try {
            // Filter tools based on search query (name, description, category, and id)
            const filteredTools = allTools.filter(tool =>
                (tool.name && tool.name.toLowerCase().includes(query)) ||
                (tool.description && tool.description.toLowerCase().includes(query)) ||
                (tool.category && tool.category.toLowerCase().includes(query)) ||
                (tool.id && tool.id.toLowerCase().includes(query))
            );

            // Display search results
            if (filteredTools.length === 0) {
                searchResults.innerHTML = `<div class="search-result-empty">No tools found matching "${query}"</div>`;
            } else {
                searchResults.innerHTML = filteredTools.map(tool => {
                    // Ensure tool properties exist with fallbacks
                    const name = tool.name || 'Unnamed Tool';
                    const icon = tool.icon || 'build';

                    // Determine the correct URL based on current page location
                    let toolUrl;

                    // Check if the URL is a placeholder (starts with #)
                    if (tool.url && tool.url.startsWith('#')) {
                        // For placeholder URLs, show a modal or alert instead of navigating
                        toolUrl = '#';
                    } else if (tool.url) {
                        // Get the current path to determine what page we're on
                        const currentPath = window.location.pathname.toLowerCase();

                        // Normalize the tool URL
                        let normalizedUrl = tool.url;

                        // Determine the correct URL path based on current location
                        if (isHomePage) {
                            // On home page, make sure URLs start with "tools/"
                            if (normalizedUrl.startsWith('../')) {
                                toolUrl = normalizedUrl.replace('../', 'tools/');
                            } else if (!normalizedUrl.startsWith('tools/') && !normalizedUrl.startsWith('http')) {
                                toolUrl = `tools/${normalizedUrl}`;
                            } else {
                                toolUrl = normalizedUrl;
                            }
                        } else if (currentPath.includes('/tools/')) {
                            // On any page in the tools directory
                            if (normalizedUrl.startsWith('tools/')) {
                                toolUrl = normalizedUrl.replace('tools/', '../');
                            } else if (!normalizedUrl.startsWith('../') && !normalizedUrl.startsWith('http')) {
                                toolUrl = `../${normalizedUrl}`;
                            } else {
                                toolUrl = normalizedUrl;
                            }
                        } else {
                            // On other pages (about, privacy, etc.)
                            if (!normalizedUrl.startsWith('tools/') && !normalizedUrl.startsWith('http')) {
                                toolUrl = `tools/${normalizedUrl}`;
                            } else {
                                toolUrl = normalizedUrl;
                            }
                        }
                    } else if (tool.id) {
                        // If no URL is provided, construct one from the ID
                        if (isHomePage) {
                            toolUrl = `tools/${tool.id}/index.html`;
                        } else if (currentPath.includes('/tools/')) {
                            toolUrl = `../${tool.id}/index.html`;
                        } else {
                            toolUrl = `tools/${tool.id}/index.html`;
                        }
                    } else {
                        toolUrl = '#';
                    }

                    // No description needed for simplified popup

                    return `
                        <div class="search-result-item" data-url="${toolUrl}">
                            <span class="material-icons">${icon}</span>
                            <div>
                                <h4>${highlightMatch(name, query)}</h4>
                            </div>
                        </div>
                    `;
                }).join('');

                // Add click event to search results
                document.querySelectorAll('.search-result-item').forEach(item => {
                    item.addEventListener('click', () => {
                        if (item.dataset.url) {
                            // Get the original URL from the dataset
                            let fixedUrl = item.dataset.url;

                            // Get the current path to determine what page we're on
                            const currentPath = window.location.pathname.toLowerCase();

                            // Determine the correct URL path based on current location
                            if (isHomePage) {
                                // On home page, make sure URLs start with "tools/"
                                if (fixedUrl.startsWith('../')) {
                                    fixedUrl = fixedUrl.replace('../', 'tools/');
                                } else if (!fixedUrl.startsWith('tools/') && !fixedUrl.startsWith('http')) {
                                    fixedUrl = `tools/${fixedUrl}`;
                                }
                            } else if (currentPath.includes('/tools/')) {
                                // On any page in the tools directory
                                if (fixedUrl.startsWith('tools/')) {
                                    fixedUrl = fixedUrl.replace('tools/', '../');
                                } else if (!fixedUrl.startsWith('../') && !fixedUrl.startsWith('http')) {
                                    fixedUrl = `../${fixedUrl}`;
                                }
                            } else {
                                // On other pages (about, privacy, etc.)
                                if (!fixedUrl.startsWith('tools/') && !fixedUrl.startsWith('http')) {
                                    fixedUrl = `tools/${fixedUrl}`;
                                }
                            }

                            // Navigate directly to the tool
                            window.location.href = fixedUrl;
                        }
                    });
                });
            }

            searchResults.style.display = 'block';
        } catch (error) {
            console.error("Error in search functionality:", error);
            searchResults.innerHTML = `<div class="search-result-empty">An error occurred while searching. Please try again.</div>`;
            searchResults.style.display = 'block';
        }
    }

    // Function to initialize related tools
    function initRelatedTools() {
        try {
            // Get current tool ID from URL
            const currentPath = window.location.pathname;
            if (!currentPath) return;

            const pathParts = currentPath.split('/');
            if (!pathParts || pathParts.length === 0) return;

            const lastPart = pathParts.pop();
            if (!lastPart) return;

            const currentToolId = lastPart.replace('.html', '');
            if (!currentToolId) return;

            // Find the current tool in allTools
            const currentTool = allTools.find(tool => tool.id === currentToolId);

            if (currentTool && currentTool.relatedTools && currentTool.relatedTools.length > 0) {
                // Create related tools section
                const relatedToolsSection = document.createElement('div');
                relatedToolsSection.className = 'related-tools-section';
                relatedToolsSection.innerHTML = `
                    <h3>Related Tools</h3>
                    <div class="related-tools-container"></div>
                `;

                // Find the main content area to append the related tools section
                const mainContent = document.querySelector('.main-content') || document.querySelector('main');
                if (mainContent) {
                    mainContent.appendChild(relatedToolsSection);

                    const relatedToolsContainer = relatedToolsSection.querySelector('.related-tools-container');
                    if (!relatedToolsContainer) return;

                    // Get related tools data
                    const relatedToolsData = currentTool.relatedTools
                        .map(id => allTools.find(tool => tool && tool.id === id))
                        .filter(tool => tool); // Filter out any undefined tools

                    if (relatedToolsData.length === 0) {
                        // Remove the section if no related tools are found
                        mainContent.removeChild(relatedToolsSection);
                        return;
                    }

                    // Render related tools
                    relatedToolsData.forEach(tool => {
                        // Ensure tool properties exist with fallbacks
                        const name = tool.name || 'Unnamed Tool';
                        const description = tool.description || 'No description available';
                        const icon = tool.icon || 'build';
                        const url = tool.url || '#';

                        const toolCard = document.createElement('div');
                        toolCard.className = 'related-tool-card';
                        toolCard.innerHTML = `
                            <div class="related-tool-icon">
                                <span class="material-icons">${icon}</span>
                            </div>
                            <div class="related-tool-info">
                                <h4>${name}</h4>
                                <p>${description.substring(0, 80)}${description.length > 80 ? '...' : ''}</p>
                                <a href="${url}" class="btn btn-sm">Try it</a>
                            </div>
                        `;
                        relatedToolsContainer.appendChild(toolCard);
                    });
                }
            }
        } catch (error) {
            // Error handling
        }
    }
});

// Helper function to highlight matching text in search results
function highlightMatch(text, query) {
    if (!text || !query) return text || '';

    try {
        // Escape special regex characters in the query
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    } catch (error) {
        return text; // Return original text if there's an error
    }
}

// ===== LOAD TOOLS FROM JSON =====
document.addEventListener('DOMContentLoaded', () => {
    const toolsGrid = document.getElementById('tools-grid');
    const latestToolsCarousel = document.getElementById('latest-tools-carousel');

    // Create modal for "under production" message
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
        <div class="modal">
            <button class="modal-close" aria-label="Close modal">
                <span class="material-icons">close</span>
            </button>
            <div class="modal-icon">
                <span class="material-icons">construction</span>
            </div>
            <h3>Tool Under Development</h3>
            <p>We're working hard to bring this tool to you soon! This feature is currently under development and will be available in the near future.</p>
            <button class="btn btn-primary">Got it</button>
        </div>
    `;
    document.body.appendChild(modalOverlay);

    // Modal functionality
    const closeModal = () => {
        modalOverlay.classList.remove('active');
        setTimeout(() => {
            document.body.style.overflow = 'auto';
        }, 300);
    };

    modalOverlay.querySelector('.modal-close').addEventListener('click', closeModal);
    modalOverlay.querySelector('.btn').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // Tool click handler
    const handleToolClick = (e, toolName) => {
        if (e.target.tagName === 'A' || e.target.closest('a')) {
            e.preventDefault();
            document.body.style.overflow = 'hidden';
            modalOverlay.classList.add('active');

            // Update modal content with tool name
            const modalTitle = modalOverlay.querySelector('h3');
            modalTitle.textContent = `${toolName} - Coming Soon`;
        }
    };

    // Fetch tools data
    fetch('data/tools.json')
        .then(response => response.json())
        .then(data => {
            // Populate tools grid
            if (toolsGrid) {
                data.categories.forEach(category => {
                    // Create category header
                    const categoryHeader = document.createElement('div');
                    categoryHeader.className = 'category-header animate-on-scroll';
                    categoryHeader.innerHTML = `
                        <h2 class="category-title">
                            <span class="material-icons">${category.icon}</span>
                            ${category.name}
                        </h2>
                    `;
                    toolsGrid.appendChild(categoryHeader);

                    // Create category tools container
                    const categoryTools = document.createElement('div');
                    categoryTools.className = 'category-tools';

                    category.tools.forEach(tool => {
                        const toolCard = document.createElement('div');
                        toolCard.className = 'tool-card animate-on-scroll';
                        toolCard.innerHTML = `
                            <div class="tool-icon">
                                <span class="material-icons">${tool.icon}</span>
                            </div>
                            <h3 class="tool-name">${tool.name}</h3>
                            <p class="tool-description">${tool.description}</p>
                            <a href="${tool.url}" class="btn btn-primary">Launch</a>
                            ${tool.isNew ? '<span class="tool-badge">New</span>' : ''}
                        `;

                        // Add click event to show "under production" modal
                        toolCard.addEventListener('click', (e) => handleToolClick(e, tool.name));

                        categoryTools.appendChild(toolCard);
                    });

                    toolsGrid.appendChild(categoryTools);
                });

                // Re-trigger animation check
                document.dispatchEvent(new Event('scroll'));
            }

            // All tools section is now a simple CTA

            // Populate latest tools carousel
            if (latestToolsCarousel) {
                const newTools = data.categories.reduce((acc, category) => {
                    return acc.concat(category.tools.filter(tool => tool.isNew));
                }, []);

                newTools.forEach(tool => {
                    const toolCard = document.createElement('div');
                    toolCard.className = 'tool-card';
                    toolCard.innerHTML = `
                        <div class="tool-icon">
                            <span class="material-icons">${tool.icon}</span>
                        </div>
                        <h3 class="tool-name">${tool.name}</h3>
                        <p class="tool-description">${tool.description}</p>
                        <a href="${tool.url}" class="btn btn-primary">Launch</a>
                        <span class="tool-badge">New</span>
                    `;

                    // Add click event to show "under production" modal
                    toolCard.addEventListener('click', (e) => handleToolClick(e, tool.name));

                    latestToolsCarousel.appendChild(toolCard);
                });

                // Initialize carousel functionality
                initCarousel();
            }
        })
        .catch(() => { /* Error handling */ });
});

// ===== CAROUSEL FUNCTIONALITY =====
function initCarousel() {
    const carousel = document.getElementById('latest-tools-carousel');
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');

    if (!carousel || !prevBtn || !nextBtn) return;

    let scrollAmount = 0;
    const cardWidth = 300; // Approximate width of a card including margins

    prevBtn.addEventListener('click', () => {
        scrollAmount = Math.max(scrollAmount - cardWidth, 0);
        carousel.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    nextBtn.addEventListener('click', () => {
        scrollAmount = Math.min(scrollAmount + cardWidth, carousel.scrollWidth - carousel.clientWidth);
        carousel.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
}

// ===== NEWSLETTER FORM =====
document.addEventListener('DOMContentLoaded', () => {
    const newsletterForm = document.getElementById('newsletter-form');
    const formMessage = document.querySelector('.form-message');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;

            // Simple validation
            if (!email || !email.includes('@')) {
                formMessage.textContent = 'Please enter a valid email address.';
                formMessage.style.color = '#ff4d4d';
                return;
            }

            // Simulate form submission
            formMessage.textContent = 'Subscribing...';

            // Simulate API call
            setTimeout(() => {
                formMessage.textContent = 'Thank you for subscribing!';
                formMessage.style.color = '#4dffa6';
                newsletterForm.reset();

                // Clear success message after a few seconds
                setTimeout(() => {
                    formMessage.textContent = '';
                }, 3000);
            }, 1500);
        });
    }
});

// ===== LOTTIE ANIMATIONS =====
document.addEventListener('DOMContentLoaded', () => {
    // Function to create a default animation when JSON files can't be loaded
    const createDefaultAnimation = (container) => {
        if (!container) return false;

        try {
            // Create a simple animated circle as fallback
            container.innerHTML = `
                <div class="default-animation">
                    <div class="circle circle1"></div>
                    <div class="circle circle2"></div>
                    <div class="circle circle3"></div>
                </div>
            `;
            container.style.opacity = '1';
            return true;
        } catch (error) {
            return false;
        }
    };

    // Initialize all animations with CSS-based animations
    const initAnimations = () => {
        try {
            // Hero animation
            const heroLottieContainer = document.getElementById('hero-lottie');
            if (heroLottieContainer) {
                createDefaultAnimation(heroLottieContainer);
            }

            // Search animation
            const searchLottieContainer = document.getElementById('search-lottie');
            if (searchLottieContainer) {
                searchLottieContainer.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
                        <style>
                            @keyframes pulse {
                                0%, 100% { opacity: 0.4; transform: scale(0.95); }
                                50% { opacity: 1; transform: scale(1.05); }
                            }
                            .search-icon {
                                animation: pulse 3s ease-in-out infinite;
                                transform-origin: center;
                                fill: #5B4CC4;
                            }
                            .search-circle {
                                animation: pulse 3s ease-in-out infinite;
                                transform-origin: center;
                                fill: none;
                                stroke: #C12E61;
                                stroke-width: 5;
                            }
                        </style>
                        <g class="search-group">
                            <circle class="search-circle" cx="80" cy="80" r="40"></circle>
                            <path class="search-icon" d="M110,110 L140,140 L130,150 L100,120 Z"></path>
                        </g>
                    </svg>
                `;
                searchLottieContainer.style.opacity = '1';
            }

            // Loading animation for preloader
            const preloaderContainer = document.getElementById('preloader-lottie');
            if (preloaderContainer) {
                try {
                    // Embed lottie1.json animation data directly to avoid CORS issues
                    const lottie1AnimationData = {"v":"5.7.5","fr":100,"ip":0,"op":406,"w":1080,"h":1080,"nm":"Comp 1","ddd":0,"metadata":{"backgroundColor":{"r":255,"g":255,"b":255}},"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"8 (Group)","sr":1,"ks":{"p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":2},"s":{"a":0,"k":[100,100],"ix":2},"r":{"a":0,"k":0,"ix":2},"o":{"a":0,"k":100,"ix":2},"sk":{"a":0,"k":0,"ix":2},"sa":{"a":0,"k":0,"ix":2}},"ao":0,"shapes":[{"ty":"gr","it":[{"ty":"gr","it":[{"ty":"gr","nm":"dotR","it":[{"ty":"el","d":1,"s":{"a":0,"k":[71,71],"ix":2},"p":{"a":0,"k":[0,0],"ix":2}},{"ty":"st","c":{"a":0,"k":[0.49019607843137253,0.5137254901960784,0.5607843137254902],"ix":2},"o":{"a":0,"k":100,"ix":2},"w":{"a":0,"k":0,"ix":2},"lc":1,"lj":1,"ml":4},{"ty":"fl","c":{"a":0,"k":[0.3568627450980392,0.2980392156862745,0.7686274509803922],"ix":2},"o":{"a":0,"k":100,"ix":2},"r":1,"bm":0},{"ty":"tr","p":{"a":0,"k":[145,50],"ix":2},"a":{"a":0,"k":[0,0],"ix":2},"s":{"a":0,"k":[100,100],"ix":2},"r":{"a":0,"k":180,"ix":2},"o":{"a":0,"k":100,"ix":2},"sk":{"a":0,"k":0,"ix":2},"sa":{"a":0,"k":0,"ix":2}}]},{"ty":"gr","nm":"dotL","it":[{"ty":"el","d":1,"s":{"a":0,"k":[90,90],"ix":2},"p":{"a":0,"k":[0,0],"ix":2}},{"ty":"st","c":{"a":0,"k":[0.5568627450980392,0.6196078431372549,0.6745098039215687],"ix":2},"o":{"a":0,"k":100,"ix":2},"w":{"a":0,"k":0,"ix":2},"lc":1,"lj":1,"ml":4},{"ty":"fl","c":{"a":0,"k":[0.3568627450980392,0.2980392156862745,0.7686274509803922],"ix":2},"o":{"a":0,"k":100,"ix":2},"r":1,"bm":0},{"ty":"tr","p":{"a":0,"k":[-25.25,50],"ix":2},"a":{"a":0,"k":[0,0],"ix":2},"s":{"a":0,"k":[100,100],"ix":2},"r":{"a":0,"k":0,"ix":2},"o":{"a":0,"k":100,"ix":2},"sk":{"a":0,"k":0,"ix":2},"sa":{"a":0,"k":0,"ix":2}}]},{"ty":"tr","p":{"a":0,"k":[-10,0],"ix":2},"a":{"a":0,"k":[50,50],"ix":2},"s":{"a":0,"k":[100,100],"ix":2},"r":{"a":0,"k":0,"ix":2},"o":{"a":0,"k":100,"ix":2},"sk":{"a":0,"k":0,"ix":2},"sa":{"a":0,"k":0,"ix":2}}]},{"ty":"tr","p":{"a":0,"k":[558,504],"ix":2},"a":{"a":0,"k":[0,0],"ix":2},"s":{"a":0,"k":[180,180],"ix":2},"r":{"a":1,"k":[{"t":0,"s":[0],"i":{"x":[0.75],"y":[0.75]},"o":{"x":[0.25],"y":[0.25]}},{"t":400,"s":[-720],"i":{"x":[0.75],"y":[0.75]},"o":{"x":[0.25],"y":[0.25]}}],"ix":2},"o":{"a":0,"k":100,"ix":2},"sk":{"a":0,"k":0,"ix":2},"sa":{"a":0,"k":0,"ix":2}}]}],"ip":0,"op":407,"st":0,"bm":0},{"ddd":0,"ind":2,"ty":4,"nm":"8","sr":1,"ks":{"p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":2},"s":{"a":0,"k":[100,100],"ix":2},"r":{"a":0,"k":0,"ix":2},"o":{"a":0,"k":100,"ix":2},"sk":{"a":0,"k":0,"ix":2},"sa":{"a":0,"k":0,"ix":2}},"ao":0,"shapes":[{"ty":"gr","nm":"8","it":[{"ty":"sh","d":1,"ks":{"a":0,"k":{"c":true,"v":[[0,0],[85.509,85.509],[171.018,0],[85.509,-85.509],[0,0],[-85.509,85.509],[-171.018,0],[-85.509,-85.509],[0,0]],"i":[[0,0],[-47.225,0],[0,47.225],[47.225,0],[0,-47.225],[47.225,0],[0,47.225],[-47.225,0],[0,-47.225]],"o":[[0,47.225],[47.225,0],[0,-47.225],[-47.225,0],[0,47.225],[-47.225,0],[0,-47.225],[47.225,0],[0,0]]}}},{"ty":"tm","s":{"a":0,"k":50,"ix":2},"e":{"a":0,"k":75,"ix":2},"o":{"a":1,"k":[{"t":0,"s":[0],"i":{"x":[0.75],"y":[0.75]},"o":{"x":[0.25],"y":[0.25]}},{"t":400,"s":[720],"i":{"x":[0.75],"y":[0.75]},"o":{"x":[0.25],"y":[0.25]}}],"ix":2},"m":1},{"ty":"st","c":{"a":0,"k":[0.7568627450980392,0.1803921568627451,0.3803921568627451],"ix":2},"o":{"a":0,"k":100,"ix":2},"w":{"a":0,"k":71,"ix":2},"lc":1,"lj":1,"ml":4},{"ty":"tr","p":{"a":0,"k":[558,504],"ix":2},"a":{"a":0,"k":[0,0],"ix":2},"s":{"a":0,"k":[180,180],"ix":2},"r":{"a":1,"k":[{"t":0,"s":[0],"i":{"x":[0.75],"y":[0.75]},"o":{"x":[0.25],"y":[0.25]}},{"t":400,"s":[-720],"i":{"x":[0.75],"y":[0.75]},"o":{"x":[0.25],"y":[0.25]}}],"ix":2},"o":{"a":0,"k":100,"ix":2},"sk":{"a":0,"k":0,"ix":2},"sa":{"a":0,"k":0,"ix":2}}]}],"ip":0,"op":407,"st":0,"bm":0}],"markers":[]};

                    lottie.loadAnimation({
                        container: preloaderContainer,
                        renderer: 'svg',
                        loop: true,
                        autoplay: true,
                        animationData: lottie1AnimationData // Use embedded data instead of path
                    });
                    preloaderContainer.style.opacity = '1';
                } catch (error) {
                    // Fallback to default animation if Lottie fails
                    createDefaultAnimation(preloaderContainer);
                }
            }

            // Initialize featured tools animations
            initFeaturedToolsAnimations();
        } catch (error) {
            // Error handling
        }
    };

    // Initialize featured tools animations
    const initFeaturedToolsAnimations = () => {
        try {
            const featuredToolsAnimations = document.querySelectorAll('.featured-tool-animation');
            if (featuredToolsAnimations.length > 0) {
                featuredToolsAnimations.forEach((container, index) => {
                    if (!container) return;

                    try {
                        // Use CSS-based animations
                        container.innerHTML = `
                            <div class="featured-animation-wrapper animation-style-${(index % 3) + 1}">
                                <div class="featured-animation-circle"></div>
                                <div class="featured-animation-shape"></div>
                            </div>
                        `;
                        container.style.opacity = '1';
                    } catch (error) {
                        // Error handling
                    }
                });
            }

            // File tools animation
            const fileToolsAnimation = document.getElementById('file-tools-animation');
            if (fileToolsAnimation) {
                fileToolsAnimation.innerHTML = `
                    <div class="file-tools-animation-wrapper">
                        <div class="file-icon"></div>
                        <div class="file-lines">
                            <div class="file-line line1"></div>
                            <div class="file-line line2"></div>
                            <div class="file-line line3"></div>
                        </div>
                    </div>
                `;
                fileToolsAnimation.style.opacity = '1';
            }
        } catch (error) {
            // Error handling
        }
    };

    // Start the initialization process
    initAnimations();
});

// ===== STICKY HEADER & FLOATING SEARCH BUTTON =====
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const floatingSearchBtn = document.querySelector('.floating-search-btn');

    // Initially hide the floating search button
    if (floatingSearchBtn) {
        floatingSearchBtn.style.transform = 'translateY(100px)';
        floatingSearchBtn.style.opacity = '0';
    }

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Handle sticky header
        if (scrollTop > 50) {
            header.style.padding = '0.5rem 0';
            header.style.boxShadow = 'var(--shadow-md)';
        } else {
            header.style.padding = 'var(--spacing-sm) 0';
            header.style.boxShadow = 'var(--shadow-sm)';
        }

        // Handle floating search button visibility
        if (scrollTop > 300) {
            // Show floating search button
            if (floatingSearchBtn) {
                floatingSearchBtn.style.transform = 'translateY(0)';
                floatingSearchBtn.style.opacity = '1';
            }
        } else {
            // Hide floating search button
            if (floatingSearchBtn) {
                floatingSearchBtn.style.transform = 'translateY(100px)';
                floatingSearchBtn.style.opacity = '0';
            }
        }
    });
});

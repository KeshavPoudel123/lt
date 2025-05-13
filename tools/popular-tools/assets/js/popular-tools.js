// ===== POPULAR TOOLS PAGE SPECIFIC JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the popular tools page
    initPopularToolsPage();

    // Initialize Lottie animation
    initLottieAnimation();

    // Navigation menu toggle is now handled by main.js

    // Initialize search functionality
    initSearch();

    // Initialize scroll animations
    initScrollAnimations();
});

/**
 * Initialize the popular tools page
 */
function initPopularToolsPage() {
    const popularToolsGrid = document.getElementById('popular-tools-grid');
    const toolsFilter = document.getElementById('tools-filter');

    // Global variables to store tools data
    let allTools = [];
    let filteredTools = [];

    // Popular tools data - these are selected from the most popular tools across categories
    const popularToolsData = [
        {
            id: "online-notepad",
            name: "Online Notepad",
            description: "A simple, distraction-free online text editor for quick notes and writing.",
            icon: "edit_note",
            category: "Text Tools",
            categoryId: "text-tools",
            categoryIcon: "text_format",
            isNew: false,
            url: "../onlinenotepad/index.html",
            popularity: 98
        },
        {
            id: "qr-code-generator",
            name: "QR Code Generator",
            description: "Create QR codes for URLs, text, contact info, and more.",
            icon: "qr_code",
            category: "Utility Tools",
            categoryId: "utility-tools",
            categoryIcon: "build",
            isNew: true,
            url: "../qr-generator/index.html",
            popularity: 95
        },
        {
            id: "json-formatter",
            name: "JSON Formatter",
            description: "Format, validate, and beautify JSON data.",
            icon: "data_object",
            category: "Developer Tools",
            categoryId: "developer-tools",
            categoryIcon: "code",
            isNew: false,
            url: "../json-formatter/index.html",
            popularity: 92
        },
        {
            id: "word-counter",
            name: "Word Counter",
            description: "Count words, characters, and paragraphs in your text with detailed statistics.",
            icon: "format_list_numbered",
            category: "Text Tools",
            categoryId: "text-tools",
            categoryIcon: "text_format",
            isNew: false,
            url: "../word-counter/index.html",
            popularity: 90
        },

        {
            id: "unit-converter",
            name: "Unit Converter",
            description: "Convert between different units of measurement.",
            icon: "swap_vert",
            category: "Utility Tools",
            categoryId: "utility-tools",
            categoryIcon: "build",
            isNew: true,
            url: "../unit-converter/index.html",
            popularity: 87
        },
        {
            id: "pdf-converter",
            name: "PDF Converter",
            description: "Convert documents to and from PDF format with ease.",
            icon: "picture_as_pdf",
            category: "File Tools",
            categoryId: "file-tools",
            categoryIcon: "folder",
            isNew: true,
            url: "../pdf-converter/index.html",
            popularity: 86
        },
        {
            id: "password-generator",
            name: "Password Generator",
            description: "Generate strong, secure passwords with customizable options.",
            icon: "password",
            category: "Utility Tools",
            categoryId: "utility-tools",
            categoryIcon: "build",
            isNew: true,
            url: "../password-generator/index.html",
            popularity: 85
        },
        {
            id: "markdown-editor",
            name: "Markdown Editor",
            description: "Write and preview Markdown with syntax highlighting and live preview.",
            icon: "code",
            category: "Text Tools",
            categoryId: "text-tools",
            categoryIcon: "text_format",
            isNew: true,
            url: "../markdown-editor/index.html",
            popularity: 84
        },
        {
            id: "image-resizer",
            name: "Image Resizer",
            description: "Resize, crop, and optimize images for web or print.",
            icon: "crop",
            category: "Image Tools",
            categoryId: "image-tools",
            categoryIcon: "image",
            isNew: true,
            url: "../img-resizer/index.html",
            popularity: 83
        },
        {
            id: "meme-generator",
            name: "Meme Generator",
            description: "Create custom memes with your own images and text.",
            icon: "sentiment_very_satisfied",
            category: "Image Tools",
            categoryId: "image-tools",
            categoryIcon: "image",
            isNew: true,
            url: "../meme-generator/index.html",
            popularity: 82
        },
        {
            id: "image-editor",
            name: "Image Editor",
            description: "Edit images with filters, effects, and adjustments in your browser.",
            icon: "photo_filter",
            category: "Image Tools",
            categoryId: "image-tools",
            categoryIcon: "image",
            isNew: false,
            url: "../image-editor/index.html",
            popularity: 81
        },
        {
            id: "image-converter",
            name: "Image Converter",
            description: "Convert images between formats like JPG, PNG, WebP, and more.",
            icon: "swap_horiz",
            category: "Image Tools",
            categoryId: "image-tools",
            categoryIcon: "image",
            isNew: false,
            url: "../image-converter/index.html",
            popularity: 80
        },
        {
            id: "lipsum-generator",
            name: "Lorem Ipsum Generator",
            description: "Generate Lorem Ipsum placeholder text for your designs, layouts, and mockups.",
            icon: "format_align_left",
            category: "Text Tools",
            categoryId: "text-tools",
            categoryIcon: "text_format",
            isNew: true,
            url: "../lipsum-generator/index.html",
            popularity: 80
        },

    ];

    // Sort tools by popularity (highest first)
    allTools = popularToolsData.sort((a, b) => b.popularity - a.popularity);
    filteredTools = [...allTools];

    // Render all tools
    renderTools(filteredTools, popularToolsGrid);

    // Add event listener for filtering
    if (toolsFilter) {
        // Add keydown event for Enter key to redirect to search page
        toolsFilter.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const searchTerm = toolsFilter.value.trim();
                if (searchTerm !== '') {
                    window.location.href = `../search.html?q=${encodeURIComponent(searchTerm)}#search-results`;
                }
            }
        });

        // Filter tools as user types
        toolsFilter.addEventListener('input', () => {
            const searchTerm = toolsFilter.value.toLowerCase().trim();

            // Filter tools based on search term
            filteredTools = allTools.filter(tool => {
                return tool.name.toLowerCase().includes(searchTerm) ||
                       tool.description.toLowerCase().includes(searchTerm) ||
                       tool.category.toLowerCase().includes(searchTerm);
            });

            // Render filtered tools
            renderTools(filteredTools, popularToolsGrid);
        });
    }

    // Add event listener for search button
    const toolsSearchButton = document.getElementById('tools-search-button');
    if (toolsSearchButton && toolsFilter) {
        toolsSearchButton.addEventListener('click', () => {
            const searchTerm = toolsFilter.value.trim();
            if (searchTerm !== '') {
                window.location.href = `../search.html?q=${encodeURIComponent(searchTerm)}#search-results`;
            }
        });
    }
}

/**
 * Render tools in the grid
 * @param {Array} tools - Array of tools to render
 * @param {HTMLElement} container - Container element for tools
 */
function renderTools(tools, container) {
    // Clear container
    container.innerHTML = '';

    if (tools.length === 0) {
        // Show no results message
        container.innerHTML = `
            <div class="no-results">
                <span class="material-icons">search_off</span>
                <h3>No tools found</h3>
                <p>Try adjusting your search criteria</p>
            </div>
        `;
        return;
    }

    // Render tools
    tools.forEach(tool => {
        const toolCard = createToolCard(tool);
        container.appendChild(toolCard);
    });
}

/**
 * Create a tool card element
 * @param {Object} tool - Tool data
 * @returns {HTMLElement} - Tool card element
 */
function createToolCard(tool) {
    const toolCard = document.createElement('div');
    toolCard.className = 'tool-card animate-on-scroll';
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
 * Initialize Lottie animation
 */
function initLottieAnimation() {
    const lottieContainer = document.getElementById('popular-tools-lottie');
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
                .star {
                    animation: pulse 2s ease-in-out infinite;
                    transform-origin: center;
                    fill: #5B4CC4;
                }
                .star2 {
                    animation: pulse 3s ease-in-out infinite;
                    transform-origin: center;
                    fill: #C12E61;
                }
                .circle {
                    animation: rotate 10s linear infinite;
                    transform-origin: center;
                    stroke: #5B4CC4;
                    stroke-width: 2;
                    fill: none;
                }
            </style>
            <circle class="circle" cx="100" cy="100" r="80"></circle>
            <polygon class="star" points="100,20 85,70 35,70 75,100 60,150 100,120 140,150 125,100 165,70 115,70"></polygon>
            <polygon class="star2" points="100,50 90,80 60,80 85,100 75,130 100,110 125,130 115,100 140,80 110,80"></polygon>
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
    const toolsFilter = document.getElementById('tools-filter');
    const mobileSearchInput = document.getElementById('mobile-search-input');
    const mobileSearchButton = document.getElementById('mobile-search-button');

    // The tools filter input is already handled in initPopularToolsPage function

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

    // The header search and floating search button are now handled by main.js
}

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    // Function to check if an element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
        );
    }

    // Function to handle scroll animation
    function handleScrollAnimation() {
        animatedElements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('visible');
            }
        });
    }

    // Add event listener for scroll
    window.addEventListener('scroll', handleScrollAnimation);

    // Trigger once on load
    handleScrollAnimation();
}

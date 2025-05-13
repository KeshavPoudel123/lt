// ===== TOOL PAGE FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Preloader Animation
    const preloaderContainer = document.getElementById('preloader-lottie');
    if (preloaderContainer && window.lottie) {
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

    // Initialize Coming Soon Animation
    const comingSoonContainer = document.getElementById('coming-soon-lottie');
    if (comingSoonContainer && window.lottie) {
        lottie.loadAnimation({
            container: comingSoonContainer,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '../assets/animations/coming-soon.json'
        });
    }

    // Initialize feature animations
    const featureAnimations = document.querySelectorAll('.feature-animation');
    if (featureAnimations.length > 0 && window.lottie) {
        featureAnimations.forEach((container, index) => {
            // Use lottie2.json for all animations
            const animationPath = '../assets/animations/lottie2.json';

            lottie.loadAnimation({
                container: container,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: animationPath
            });
        });
    }

    // Initialize tool icon animation
    const toolIconAnimation = document.querySelector('.tool-hero-content .tool-icon-animation');
    if (toolIconAnimation && window.lottie) {
        lottie.loadAnimation({
            container: toolIconAnimation,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '../assets/animations/lottie2.json'
        });
    }

    // Initialize Search Functionality
    initializeSearch();
});

// ===== SEARCH FUNCTIONALITY =====
function initializeSearch() {
    const searchInput = document.querySelector('.search-box input');
    const searchResults = document.querySelector('.search-results');

    if (!searchInput || !searchResults) return;

    // Load tools data for search
    fetch('../data/tools.json')
        .then(response => response.json())
        .then(data => {
            // Create a flat array of all tools
            const allTools = data.categories.reduce((acc, category) => {
                return acc.concat(category.tools.map(tool => ({
                    ...tool,
                    category: category.name,
                    categoryIcon: category.icon
                })));
            }, []);

            // Add event listeners for search
            searchInput.addEventListener('focus', () => {
                searchResults.style.display = 'block';
            });

            searchInput.addEventListener('blur', () => {
                // Delay hiding to allow for clicking on results
                setTimeout(() => {
                    searchResults.style.display = 'none';
                }, 200);
            });

            searchInput.addEventListener('input', () => {
                const query = searchInput.value.toLowerCase().trim();

                if (query.length < 2) {
                    searchResults.innerHTML = '';
                    searchResults.style.display = 'none';
                    return;
                }

                // Filter tools based on search query
                const filteredTools = allTools.filter(tool =>
                    tool.name.toLowerCase().includes(query) ||
                    tool.description.toLowerCase().includes(query) ||
                    tool.category.toLowerCase().includes(query)
                );

                // Display search results
                if (filteredTools.length === 0) {
                    searchResults.innerHTML = `<div class="search-result-empty">No tools found matching "${query}"</div>`;
                } else {
                    searchResults.innerHTML = filteredTools.map(tool => `
                        <div class="search-result-item" data-url="${tool.url.replace('#', '../tools/') + '.html'}">
                            <span class="material-icons">${tool.icon}</span>
                            <div>
                                <h4>${highlightMatch(tool.name, query)}</h4>
                                <p>${highlightMatch(tool.description.substring(0, 60) + (tool.description.length > 60 ? '...' : ''), query)}</p>
                            </div>
                        </div>
                    `).join('');

                    // Add click event to search results
                    document.querySelectorAll('.search-result-item').forEach(item => {
                        item.addEventListener('click', () => {
                            window.location.href = item.dataset.url;
                        });
                    });
                }

                searchResults.style.display = 'block';
            });
        })
        .catch(error => console.error('Error loading tools data for search:', error));
}

// Helper function to highlight matching text in search results
function highlightMatch(text, query) {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

// Function to create a default animation when JSON files can't be loaded
function createDefaultAnimation(container) {
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
}

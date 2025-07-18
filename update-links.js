// update-links.js (located at the root of your Cody-Dream repo)

(async function() {
    // Determine the base path for GitHub Pages projects
    // For https://codydream.github.io/Cody-Dream/, this should be '/Cody-Dream/'
    // For local development (e.g., http://localhost:8000/), this should be '/'
    const getBasePath = () => {
        // If running on GitHub Pages (check for repo name in URL)
        // This regex will capture the first segment after the domain, e.g., "/Cody-Dream"
        const ghPagesMatch = window.location.pathname.match(/^\/[^/]+\//);
        if (ghPagesMatch && ghPagesMatch[0].includes('Cody-Dream')) { // Make sure it's *your* repo name
             // For project pages, the base path is the repo name segment (e.g., "/Cody-Dream/")
            return ghPagesMatch[0]; 
        }
        // For local development or user/org pages, the base path is just '/'
        return '/';
    };

    const BASE_PATH = getBasePath();
    console.log(`Detected Base Path: ${BASE_PATH}`); // Good for debugging

    // Construct paths using the detected base path
    const yamlFilePath = `${BASE_PATH}Common Data/social-links.yaml`; // No leading slash here, BASE_PATH already has it
    const jsYamlCdn = 'https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js';

    // ... (your loadScript function - remains the same) ...
    function loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.async = true; 
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
            document.head.appendChild(script);
        });
    }

    try {
        await loadScript(jsYamlCdn);
        console.log("js-yaml loaded.");

        console.log(`Attempting to fetch YAML from: ${yamlFilePath}`); // Check this URL in console
        const response = await fetch(yamlFilePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} for ${yamlFilePath}`);
        }
        const yamlText = await response.text();
        console.log("YAML fetched and parsed.");

        const linksData = jsyaml.load(yamlText);

        const linkElements = document.querySelectorAll('.links-special, .fa-brands');
        
        linksData.forEach(data => {
            const targetIconClass = `fa-${data.name}`;
            const iconElement = Array.from(linkElements).find(el => el.classList.contains(targetIconClass));

            if (iconElement && iconElement.parentElement && iconElement.parentElement.tagName === 'A') {
                const parentLink = iconElement.parentElement;
                parentLink.href = data.url;
            } else {
                console.warn(`Could not find a matching link for: ${data.name}. Expected icon class: ${targetIconClass}`);
            }
        });
        console.log("Links updated.");

    } catch (error) {
        console.error('Error in social link update process:', error);
    }
})();
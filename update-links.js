(async function() {
    const yamlFilePath = './Common Data/social-links.yaml'; // Path to your YAML file

    try {
        // Fetch the YAML file
        const response = await fetch(yamlFilePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const yamlText = await response.text();

        // Parse the YAML content
        // js-yaml is expected to be globally available from the CDN script
        const linksData = jsyaml.load(yamlText);

        // Get all the link elements you want to update
        // You might want a more specific selector if these links are not unique
        const linkElements = document.querySelectorAll('.links-special, .fa-brands');

        linksData.forEach(data => {
            // Find the corresponding link element
            // We'll try to match by the icon class (e.g., 'fa-unity' to 'unity')
            const targetIconClass = `fa-${data.name}`; // e.g., fa-unity, fa-itch-io

            // Find the <i> element with the matching class and then get its parent <a>
            const iconElement = Array.from(linkElements).find(el => el.classList.contains(targetIconClass));

            if (iconElement && iconElement.parentElement && iconElement.parentElement.tagName === 'A') {
                const parentLink = iconElement.parentElement;
                parentLink.href = data.url;
                console.log(`Updated link for ${data.name} to: ${data.url}`);
            } else {
                console.warn(`Could not find a matching link for: ${data.name}. Expected icon class: ${targetIconClass}`);
            }
        });

    } catch (error) {
        console.error('Error loading or parsing social links:', error);
    }
})();
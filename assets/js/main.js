document.addEventListener("DOMContentLoaded", async () => {
    const includeElements = document.querySelectorAll("[include-html]");

    for (const el of includeElements) {
        try {
            const file = el.getAttribute("include-html");
            const response = await fetch(file);
            if (response.ok) {
                const html = await response.text();
                // Extract body content if full HTML document
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                // Load CSS links from the component
                const links = doc.querySelectorAll('link[rel="stylesheet"]');
                links.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && !document.querySelector(`link[href="${href}"]`)) {
                        const newLink = document.createElement('link');
                        newLink.rel = 'stylesheet';
                        newLink.href = href;
                        document.head.appendChild(newLink);
                    }
                });
                
                // Get content without CSS links
                const bodyContent = doc.body ? doc.body.innerHTML : html;
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = bodyContent;
                tempDiv.querySelectorAll('link[rel="stylesheet"]').forEach(link => link.remove());
                el.innerHTML = tempDiv.innerHTML;
            } else {
                console.error(`Failed to load ${file}: ${response.status}`);
            }
        } catch (error) {
            console.error(`Error loading ${el.getAttribute("include-html")}:`, error);
        }
    }
});


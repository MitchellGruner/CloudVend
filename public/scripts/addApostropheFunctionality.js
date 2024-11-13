document.addEventListener("DOMContentLoaded", function() {
    function truncateParagraphs(selector, maxLength) {
        const paragraphs = document.querySelectorAll(selector);
        paragraphs.forEach(p => {
            const originalText = p.textContent;
            if (originalText.length > maxLength) {
                const truncatedText = originalText.substring(0, maxLength) + '...';
                p.textContent = truncatedText;
            }
        });
    }

    truncateParagraphs("main section#display-items.display-items-container div:nth-child(2) div div.container p.paragraph-limit-short", 200);
    truncateParagraphs("main section#display-items.display-items-container.show-item div:nth-child(2) div div.container p", 400);
});
document.addEventListener("DOMContentLoaded", function() {
    const paragraphs = document.querySelectorAll("main section#display-items.display-items-container div:nth-child(2) div div.container p");

    paragraphs.forEach(p => {
        const originalText = p.textContent;
        const maxLength = 200;

        if (originalText.length > maxLength) {
            const truncatedText = originalText.substring(0, maxLength) + '"...';
            p.textContent = truncatedText;
        }
    });
});
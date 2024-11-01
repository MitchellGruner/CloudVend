window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    const backgroundImageDiv = $("#background-image-div");

    if (window.matchMedia('(max-width: 399px)').matches) {
        backgroundImageDiv.css("z-index", scrollPosition >= 220 ? "1" : "0");
    } else if (window.matchMedia('(min-width: 400px) and (max-width: 991px)').matches) {
        backgroundImageDiv.css("z-index", scrollPosition >= 286 ? "1" : "0");
    } else if (window.matchMedia('(min-width: 992px)').matches) {
        backgroundImageDiv.css("z-index", scrollPosition >= 400 ? "1" : "0");
    }
});
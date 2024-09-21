/* hamburger menu functionality */
document.addEventListener("DOMContentLoaded", function() {
    const hamburgerMenu = document.querySelector(".hamburger-menu");
    const offScreenMenu = document.querySelector(".off-screen-menu");
    const itemsContainer = document.querySelector(".display-items-container-div");
    const menuHeight = document.querySelector(".menu-div").offsetHeight;

    /* apply offset to hamburger items, based on height of nav */
    offScreenMenu.style.top = `${menuHeight - 1}px`;

    /* apply transition to main content */
    itemsContainer.style.transition = "opacity 0.5s ease-in-out";
    
    hamburgerMenu.addEventListener("click", () => {
        hamburgerMenu.classList.toggle("active");
        offScreenMenu.classList.toggle("active");

        /* apply opacity to the page once the hamburger menu is clicked */
        if (itemsContainer.style.opacity === "0.5") {
            itemsContainer.style.opacity = "1";
        } else {
            itemsContainer.style.opacity = "0.5";
        }
    });
});
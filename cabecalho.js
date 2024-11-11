const currentPage = window.location.pathname;

document.querySelectorAll(".navbar-links a").forEach((link) => {
    if (link.href.includes(currentPage)) {
        link.classList.add("ativo");
    } else {
        link.classList.remove("ativo");
    }
});
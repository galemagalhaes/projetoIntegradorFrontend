const currentPage = window.location.pathname;

document.querySelectorAll(".navbar-links a").forEach((link) => {
    if (link.href.includes(currentPage)) {
        link.classList.add("ativo");
    } else {
        link.classList.remove("ativo");
    }
});

document.getElementById("logoutButton").addEventListener("click", function () {

    localStorage.removeItem("auth_token");

    window.location.href = "index.html";
});
export function decodificarToken(token) {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        return null;
    }
}

export function validarToken() {
    const token = localStorage.getItem("auth_token");

    if (!token) {
        console.warn("Token não encontrado.");
        redirecionarParaLogin();
        return false;
    }

    const payload = decodificarToken(token);

    if (!payload || !payload.exp) {
        console.error("Token inválido ou sem campo de expiração.");
        redirecionarParaLogin();
        return false;
    }

    const agora = Math.floor(Date.now() / 1000);

    if (payload.exp < agora) {
        console.warn("Token expirado.");
        redirecionarParaLogin();
        return false;
    }

    console.log("Token válido.");
    return true;
}

function redirecionarParaLogin() {
    window.location.href = "index.html";
}

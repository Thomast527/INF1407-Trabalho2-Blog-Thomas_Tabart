"use strict";
window.onload = () => {
    const form = document.getElementById("registerForm");
    const msgDiv = document.getElementById("mensagem");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const payload = {
            username,
            email,
            password,
        };
        try {
            const resp = await fetch(backendAddress + "accounts/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            if (resp.ok) {
                const data = await resp.json();
                // Enregistre token
                localStorage.setItem("token", data.token);
                msgDiv.innerHTML = "✔️ Conta criada com sucesso!";
                setTimeout(() => {
                    window.location.href = "../index.html";
                }, 1500);
            }
            else {
                const erro = await resp.json();
                msgDiv.innerHTML = "❌ Erro: " + JSON.stringify(erro);
            }
        }
        catch (error) {
            console.error("Erro de rede:", error);
            msgDiv.innerHTML = "❌ Erro ao comunicar com o servidor.";
        }
    });
};

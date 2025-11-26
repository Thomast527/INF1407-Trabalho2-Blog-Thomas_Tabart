"use strict";
window.onload = () => {
    const form = document.getElementById("formArtigo");
    const msg = document.getElementById("mensagem");
    form.addEventListener("submit", evento => {
        evento.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());
        fetch(backendAddress + "blog/artigos/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
            .then(r => {
            if (r.ok) {
                msg.innerText = "Artigo criado com sucesso!";
            }
            else {
                msg.innerText = "Erro ao criar artigo.";
            }
        });
    });
};

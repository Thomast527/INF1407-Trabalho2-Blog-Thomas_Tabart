"use strict";
window.onload = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Você precisa estar logado para atualizar um artigo!");
        window.location.href = "../accounts/login.html";
        return;
    }
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) {
        alert("Erro: nenhum ID de artigo informado!");
        return;
    }
    document.getElementById("artigoId").innerText = id;
    fetch(backendAddress + "blog/umartigo/" + id + "/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + token
        }
    })
        .then(async (response) => {
        if (!response.ok) {
            const msg = await response.text();
            throw new Error("Erro ao carregar artigo: " + msg);
        }
        return response.json();
    })
        .then(artigo => {
        document.getElementById("id").value = artigo.id;
        document.getElementById("titulo").value = artigo.titulo;
        document.getElementById("conteudo").value = artigo.conteudo;
        document.getElementById("categoria").value = artigo.categoria;
    })
        .catch(err => {
        console.error(err);
        alert("Erro ao carregar o artigo.");
    });
    const botao = document.getElementById("atualiza");
    botao.addEventListener("click", (evento) => {
        evento.preventDefault();
        const form = document.getElementById("meuFormulario");
        const elements = form.elements;
        const data = {};
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (element.name) {
                data[element.name] = element.value;
            }
        }
        fetch(backendAddress + "blog/umartigo/" + id + "/", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + token
            },
            body: JSON.stringify(data)
        })
            .then(async (response) => {
            const msgDiv = document.getElementById("mensagem");
            if (response.ok) {
                msgDiv.innerHTML = "✔️ Artigo atualizado com sucesso!";
            }
            else {
                const msg = await response.text();
                msgDiv.innerHTML = "Erro: " + response.status + "<br>" + msg;
            }
        })
            .catch(err => {
            console.error(err);
            const msgDiv = document.getElementById("mensagem");
            msgDiv.innerHTML = "Erro ao comunicar com o servidor.";
        });
    });
};

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
    const categoriaSelect = document.getElementById("categoria");
    let artigoData = null;
    Promise.all([
        fetch(backendAddress + "blog/umartigo/" + id + "/", {
            headers: { "Authorization": "Token " + token }
        }).then(r => r.json()),
        fetch(backendAddress + "blog/categorias/")
            .then(r => r.json())
    ])
        .then(([artigo, categorias]) => {
        artigoData = artigo;
        // Remplit le formulaire
        document.getElementById("id").value = artigo.id;
        document.getElementById("titulo").value = artigo.titulo;
        document.getElementById("conteudo").value = artigo.conteudo;
        // 🔵 Remplir le select des catégories
        categorias.forEach((cat) => {
            const opt = document.createElement("option");
            opt.value = cat.id;
            opt.textContent = cat.nome;
            // Pré-sélectionner la catégorie actuelle
            if (cat.id === artigo.categoria) {
                opt.selected = true;
            }
            categoriaSelect.appendChild(opt);
        });
    })
        .catch(err => {
        console.error(err);
        alert("Erro ao carregar dados.");
    });
    const botao = document.getElementById("atualiza");
    botao.addEventListener("click", (evento) => {
        evento.preventDefault();
        const data = {
            id: artigoData.id,
            titulo: document.getElementById("titulo").value,
            conteudo: document.getElementById("conteudo").value,
            categoria: categoriaSelect.value
        };
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

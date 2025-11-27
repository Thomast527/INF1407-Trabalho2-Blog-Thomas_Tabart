"use strict";
window.onload = () => {
    // 1) Récupère l'ID dans l'URL (ex: update.html?id=12)
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) {
        alert("Erro: nenhum ID de artigo informado!");
        return;
    }
    // Affiche l'ID dans le titre
    document.getElementById("artigoId").innerText = id;
    // 2) Charge les données du carro pour pré-remplir le formulaire
    fetch(backendAddress + "blog/umartigo/" + id + "/")
        .then(response => response.json())
        .then(artigo => {
        document.getElementById("id").value = artigo.id;
        document.getElementById("titulo").value = artigo.titulo;
        document.getElementById("conteudo").value = artigo.conteudo;
        document.getElementById("categoria").value = artigo.categoria;
        document.getElementById("autor").value = artigo.autor;
    })
        .catch(err => console.error(err));
    // 3) Gestion du bouton Atualiza
    const botao = document.getElementById('atualiza');
    botao.addEventListener('click', (evento) => {
        evento.preventDefault();
        const form = document.getElementById('meuFormulario');
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
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => {
            const msgDiv = document.getElementById('mensagem');
            if (response.ok) {
                msgDiv.innerHTML = "✔️ Sucesso ao atualizar!";
            }
            else {
                msgDiv.innerHTML =
                    "Erro: " + response.status + " " + response.statusText;
            }
        })
            .catch(err => {
            console.error(err);
            document.getElementById('mensagem').innerHTML =
                "Erro de comunicação com servidor.";
        });
    });
};

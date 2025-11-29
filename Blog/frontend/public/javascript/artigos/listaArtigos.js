"use strict";
async function obtemUsuario() {
    const token = localStorage.getItem("token");
    if (!token)
        return null;
    const resp = await fetch(backendAddress + "accounts/me/", {
        method: "GET",
        headers: {
            "Authorization": "Token " + token
        }
    });
    if (resp.ok) {
        return await resp.json();
    }
    return null;
}
window.onload = async () => {
    var _a, _b;
    const user = await obtemUsuario();
    const botaoInsere = document.getElementById('insere');
    const botaoRemove = document.getElementById('remove');
    // Si l'utilisateur n'est pas auteur, cacher les boutons et la sélection
    const ehAutor = (_b = (_a = user === null || user === void 0 ? void 0 : user.groups) === null || _a === void 0 ? void 0 : _a.some((g) => { var _a; return ((_a = g.name) !== null && _a !== void 0 ? _a : g).toLowerCase() === "escritor"; })) !== null && _b !== void 0 ? _b : false;
    console.log("GROUPS:", user === null || user === void 0 ? void 0 : user.groups);
    console.log("isEscritor =", ehAutor);
    if (!ehAutor) {
        botaoInsere.style.display = "none";
        botaoRemove.style.display = "none";
    }
    botaoInsere.addEventListener('click', () => {
        location.href = 'insereArtigo.html';
    });
    botaoRemove.addEventListener("click", apagaArtigos);
    exibeListaDeArtigos(ehAutor);
};
function exibeListaDeArtigos(ehAutor) {
    const mostrarCheckbox = ehAutor !== null && ehAutor !== void 0 ? ehAutor : false; // par défaut faux si pas fourni
    fetch(backendAddress + "blog/lista/")
        .then(resp => resp.json())
        .then(artigos => {
        const container = document.getElementById('artigosContainer');
        container.innerHTML = "";
        artigos.forEach((artigo) => {
            const div = document.createElement('div');
            div.className = 'col-md-6 col-lg-4';
            div.innerHTML = `
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title">
                                <a href="viewArtigo.html?id=${artigo.id}">${artigo.titulo}</a>
                            </h5>
                            <p class="card-text"><strong>Autor:</strong> ${artigo.autor}</p>
                            <p class="card-text"><small class="text-muted">${artigo.data_publicacao}</small></p>
                        </div>
                        ${mostrarCheckbox ? `
                        <div class="card-footer">
                            <input type="checkbox" class="form-check-input remove-checkbox" value="${artigo.id}">
                            <label class="form-check-label">Selecionar para remover</label>
                        </div>` : ''}
                    </div>
                `;
            container.appendChild(div);
        });
    })
        .catch(error => console.error("Erro:", error));
}
let apagaArtigos = (evento) => {
    evento.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Você precisa estar logado para remover artigos!");
        return;
    }
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const checkedValues = [];
    checkboxes.forEach(cb => checkedValues.push(cb.value));
    if (checkedValues.length === 0) {
        alert("Selecione pelo menos um artigo para remover.");
        return;
    }
    fetch(backendAddress + "blog/lista/", {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        },
        body: JSON.stringify(checkedValues)
    })
        .then(async (response) => {
        if (response.ok) {
            alert('Artigos removidos com sucesso!');
        }
        else {
            const msg = await response.text();
            alert('Erro ao remover: ' + response.status + "\n" + msg);
        }
    })
        .catch(error => {
        console.log(error);
        alert('Erro de comunicação com o servidor.');
    })
        .finally(exibeListaDeArtigos);
};

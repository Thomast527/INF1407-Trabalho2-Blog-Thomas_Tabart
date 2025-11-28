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
    const isEscritor = (_b = (_a = user === null || user === void 0 ? void 0 : user.groups) === null || _a === void 0 ? void 0 : _a.includes("escritor")) !== null && _b !== void 0 ? _b : false;
    if (!isEscritor) {
        botaoInsere.style.display = "none";
    }
    botaoInsere.addEventListener('click', () => {
        location.href = 'insereArtigo.html';
    });
    document.getElementById("remove")
        .addEventListener("click", apagaArtigos);
    exibeListaDeArtigos();
};
function exibeListaDeArtigos() {
    fetch(backendAddress + "blog/lista/")
        .then(resp => resp.json())
        .then(artigos => {
        let tbody = document.getElementById('idtbody');
        tbody.innerHTML = "";
        artigos.forEach((artigo) => {
            let tr = document.createElement('tr');
            tr.innerHTML = `
                    <td><a href="viewArtigo.html?id=${artigo.id}">${artigo.titulo}</a></td>
                    <td>${artigo.autor}</td>
                    <td>${artigo.data_publicacao}</td>
                `;
            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = artigo.id;
            let td = document.createElement('td');
            td.appendChild(checkbox);
            tr.appendChild(td);
            tbody.appendChild(tr);
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

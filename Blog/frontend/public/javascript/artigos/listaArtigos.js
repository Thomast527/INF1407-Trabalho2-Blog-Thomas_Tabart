"use strict";
onload = () => {
    document.getElementById('insere').
        addEventListener('click', evento => { location.href = 'insereArtigo.html'; });
    document.getElementById("remove").addEventListener("click", apagaArtigos);
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
                    <td><a href="update.html?id=${artigo.id}">${artigo.titulo}</a></td>
                    <td>${artigo.autor}</td>
                    <td>${artigo.data_publicacao}</td>
                `;
            let checkbox = document.createElement('input');
            checkbox.setAttribute('type', 'checkbox');
            checkbox.setAttribute('name', 'id');
            checkbox.setAttribute('id', 'id');
            checkbox.setAttribute('value', artigo.id); // L'ID de l'article pour la suppression
            let td = document.createElement('td');
            td.appendChild(checkbox);
            tr.appendChild(td);
            tbody.appendChild(tr);
        });
    })
        .catch(error => {
        console.error("Erro:", error);
    });
}
let apagaArtigos = (evento) => {
    evento.preventDefault();
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const checkedValues = [];
    checkboxes.forEach(checkbox => { checkedValues.push(checkbox.value); });
    fetch(backendAddress + "blog/lista/", {
        method: 'DELETE',
        body: JSON.stringify(checkedValues),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => {
        if (response.ok) {
            alert('Artigos removidos com sucesso!');
        }
        else {
            alert('Artigos removidos com erro');
        }
    })
        .catch(error => {
        console.log(error);
        alert('Erro de comunicacao com o servedor');
    })
        .finally(() => {
        exibeListaDeArtigos();
    });
};

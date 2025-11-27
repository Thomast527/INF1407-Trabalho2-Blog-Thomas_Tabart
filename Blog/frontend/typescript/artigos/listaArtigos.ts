onload = () => {
    (document.getElementById('insere') as HTMLButtonElement).
        addEventListener('click', evento => { location.href = 'insereArtigo.html' });

    document.getElementById("remove")!.addEventListener("click", apagaArtigos);

    exibeListaDeArtigos();
};

function exibeListaDeArtigos() {
    fetch(backendAddress + "blog/lista/")
        .then(resp => resp.json())
        .then(artigos => {
            let tbody = document.getElementById('idtbody') as HTMLTableSectionElement;
            tbody.innerHTML = "";

            artigos.forEach((artigo: any) => {
                let tr = document.createElement('tr');

                tr.innerHTML = `
                    <td><a href="update.html?id=${artigo.id}">${artigo.titulo}</a></td>
                    <td>${artigo.autor}</td>
                    <td>${artigo.data_publicacao}</td>
                `;

                let checkbox = document.createElement('input') as HTMLInputElement;
                checkbox.setAttribute('type', 'checkbox');
                checkbox.setAttribute('name', 'id');
                checkbox.setAttribute('id', 'id');
                checkbox.setAttribute('value', artigo.id); // L'ID de l'article pour la suppression

                let td = document.createElement('td') as HTMLTableCellElement;
                td.appendChild(checkbox);
                tr.appendChild(td);

                tbody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error("Erro:", error);
        });
}

let apagaArtigos = (evento: Event) => {
    evento.preventDefault();

    const checkboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:checked');
    const checkedValues: string[] = [];

    checkboxes.forEach(checkbox => { checkedValues.push(checkbox.value); });

    fetch(backendAddress + "blog/lista/", {
        method: 'DELETE',
        body: JSON.stringify(checkedValues),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        if (response.ok) {
            alert('Artigos removidos com sucesso!');
        } else {
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
}

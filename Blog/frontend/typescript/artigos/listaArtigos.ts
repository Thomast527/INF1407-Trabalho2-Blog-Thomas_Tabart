onload = () => {
    document.getElementById("novo")!.addEventListener("click", () => {
        window.location.href = "insereArtigo.html";
    });

    exibeListaDeArtigos();
};

function exibeListaDeArtigos() {
    fetch(backendAddress + "blog/artigos/")
        .then(resp => resp.json())
        .then(artigos => {
            let tbody = document.getElementById('idtbody') as HTMLTableSectionElement;
            tbody.innerHTML = "";

            artigos.forEach((artigo:any) => {
                let tr = document.createElement('tr');

                tr.innerHTML = `
                    <td><a href="detalheArtigo.html?id=${artigo.id}">${artigo.titulo}</a></td>
                    <td>${artigo.autor}</td>
                    <td>${artigo.data_publicacao}</td>
                `;

                tbody.appendChild(tr);
            });
        });
}

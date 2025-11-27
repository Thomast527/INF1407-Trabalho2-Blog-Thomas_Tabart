window.onload = () => {

    // 1) Récupère l'ID dans l'URL (ex: update.html?id=12)
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        alert("Erro: nenhum ID de artigo informado!");
        return;
    }

    // Affiche l'ID dans le titre
    (document.getElementById("artigoId") as HTMLSpanElement).innerText = id;

    // 2) Charge les données du carro pour pré-remplir le formulaire
    fetch(backendAddress + "blog/umartigo/" + id + "/")
        .then(response => response.json())
        .then(artigo => {
            (document.getElementById("id") as HTMLInputElement).value = artigo.id;
            (document.getElementById("titulo") as HTMLInputElement).value = artigo.titulo;
            (document.getElementById("conteudo") as HTMLInputElement).value = artigo.conteudo;
            (document.getElementById("categoria") as HTMLInputElement).value = artigo.categoria;
            (document.getElementById("autor") as HTMLInputElement).value = artigo.autor;
        })
        .catch(err => console.error(err));

    // 3) Gestion du bouton Atualiza
    const botao = document.getElementById('atualiza') as HTMLButtonElement;

    botao.addEventListener('click', (evento) => {
        evento.preventDefault();

        const form = document.getElementById('meuFormulario') as HTMLFormElement;
        const elements = form.elements;
        const data: Record<string, string> = {};

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i] as HTMLInputElement;
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
            const msgDiv = document.getElementById('mensagem') as HTMLDivElement;

            if (response.ok) {
                msgDiv.innerHTML = "✔️ Sucesso ao atualizar!";
            } else {
                msgDiv.innerHTML =
                    "Erro: " + response.status + " " + response.statusText;
            }
        })
        .catch(err => {
            console.error(err);
            (document.getElementById('mensagem') as HTMLDivElement).innerHTML =
                "Erro de comunicação com servidor.";
        });
    });
};

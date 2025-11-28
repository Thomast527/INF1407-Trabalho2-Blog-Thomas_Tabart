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

    (document.getElementById("artigoId") as HTMLSpanElement).innerText = id;

    const categoriaSelect = document.getElementById("categoria") as HTMLSelectElement;

    let artigoData: any = null;

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
        (document.getElementById("id") as HTMLInputElement).value = artigo.id;
        (document.getElementById("titulo") as HTMLInputElement).value = artigo.titulo;
        (document.getElementById("conteudo") as HTMLInputElement).value = artigo.conteudo;

        // 🔵 Remplir le select des catégories
        categorias.forEach((cat: any) => {
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

    const botao = document.getElementById("atualiza") as HTMLButtonElement;

    botao.addEventListener("click", (evento) => {
        evento.preventDefault();

        const data = {
            id: artigoData.id,
            titulo: (document.getElementById("titulo") as HTMLInputElement).value,
            conteudo: (document.getElementById("conteudo") as HTMLTextAreaElement).value,
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
            const msgDiv = document.getElementById("mensagem") as HTMLDivElement;

            if (response.ok) {
                msgDiv.innerHTML = "✔️ Artigo atualizado com sucesso!";
            } else {
                const msg = await response.text();
                msgDiv.innerHTML = "Erro: " + response.status + "<br>" + msg;
            }
        })
        .catch(err => {
            console.error(err);
            const msgDiv = document.getElementById("mensagem") as HTMLDivElement;
            msgDiv.innerHTML = "Erro ao comunicar com o servidor.";
        });
    });
};

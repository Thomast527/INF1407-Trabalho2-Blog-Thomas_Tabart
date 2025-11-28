window.onload = () => {

    const categoriaSelect = document.getElementById("categoria") as HTMLSelectElement;

    fetch(backendAddress + "blog/categorias/")
        .then(res => res.json())
        .then(categorias => {
            categorias.forEach((cat: any) => {
                const opt = document.createElement("option");
                opt.value = cat.id;
                opt.textContent = cat.nome;
                categoriaSelect.appendChild(opt);
            });
        })
        .catch(err => console.error("Erro ao carregar categorias:", err));

    const form = document.getElementById("meuFormulario") as HTMLFormElement;
    const mensagemDiv = document.getElementById("mensagem") as HTMLDivElement;

    form.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            mensagemDiv.innerText = "Você precisa estar logado!";
            return;
        }

        const data = {
            titulo: (document.getElementById("titulo") as HTMLInputElement).value,
            conteudo: (document.getElementById("conteudo") as HTMLTextAreaElement).value,
            categoria: categoriaSelect.value
        };

        fetch(backendAddress + "blog/umartigo/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + token,
            },
            body: JSON.stringify(data),
        })
        .then(async (response) => {
            if (response.ok) {
                mensagemDiv.innerText = "Artigo inserido com sucesso!";
                form.reset();
            } else {
                const erroTxt = await response.text();
                mensagemDiv.innerText =
                    "Erro ao inserir artigo: " + response.status + "\n" + erroTxt;
            }
        })
        .catch(err => {
            console.error(err);
            mensagemDiv.innerText = "Erro de comunicação com servidor.";
        });
    });
};

window.onload = () => {
    const botao = document.getElementById('insere') as HTMLButtonElement | null;
    const form = document.getElementById('meuFormulario') as HTMLFormElement | null;
    const mensagemDiv = document.getElementById('mensagem') as HTMLDivElement | null;

    if (!botao || !form || !mensagemDiv) {
        console.error('Elementos do formulário não foram encontrados.');
        return;
    }

    botao.addEventListener('click', (evento) => {
        evento.preventDefault();

        const elements = form.elements;
        const data: Record<string, string> = {};

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i] as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
            if (element.name) {
                data[element.name] = element.value;
            }
        }

        fetch(backendAddress + 'blog/artigos/', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        })
        .then((response) => {
            if (response.ok) {
                mensagemDiv.innerHTML = 'Artigo inserido com sucesso!';
                form.reset();
            } else {
                mensagemDiv.innerHTML = 'Erro ao inserir artigo.';
            }
        })
        .catch((error) => {
            console.error(error);
            mensagemDiv.innerHTML = 'Erro de comunicação com o servidor.';
        });
    });
};

"use strict";
window.onload = () => {
    const form = document.getElementById('meuFormulario');
    const mensagemDiv = document.getElementById('mensagem');
    form.addEventListener('submit', (evento) => {
        evento.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            mensagemDiv.innerText = "Você precisa estar logado para publicar um artigo.";
            return;
        }
        const data = {};
        const elements = form.elements;
        for (let i = 0; i < elements.length; i++) {
            const el = elements[i];
            if (!el.name)
                continue;
            data[el.name] = el.type === 'number' ? Number(el.value) : el.value;
        }
        fetch(backendAddress + 'blog/umartigo/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': tokenKeyword + localStorage.getItem('token'),
            },
            body: JSON.stringify(data),
        })
            .then(async (response) => {
            if (response.ok) {
                mensagemDiv.innerText = '✔️ Artigo inserido com sucesso!';
                form.reset();
            }
            else {
                const texto = await response.text();
                mensagemDiv.innerText = 'Erro ao inserir: ' + response.status + ' ' + texto;
            }
        })
            .catch(() => {
            mensagemDiv.innerText = 'Erro de comunicação com o servidor.';
        });
    });
};

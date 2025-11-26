"use strict";
window.onload = () => {
    const botao = document.getElementById('insere');
    const form = document.getElementById('meuFormulario');
    const mensagemDiv = document.getElementById('mensagem');
    if (!botao || !form || !mensagemDiv) {
        console.error('Elementos do formulário não foram encontrados.');
        return;
    }
    botao.addEventListener('click', (evento) => {
        evento.preventDefault();
        const elements = form.elements;
        const data = {};
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
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
            }
            else {
                mensagemDiv.innerHTML = 'Erro ao inserir artigo.';
            }
        })
            .catch((error) => {
            console.error(error);
            mensagemDiv.innerHTML = 'Erro de comunicação com o servidor.';
        });
    });
};

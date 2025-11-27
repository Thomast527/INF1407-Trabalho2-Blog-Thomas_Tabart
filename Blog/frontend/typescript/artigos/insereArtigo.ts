window.onload = () => {
  const botao = document.getElementById('insere') as HTMLButtonElement | null;
  const form = document.getElementById('meuFormulario') as HTMLFormElement | null;
  const mensagemDiv = document.getElementById('mensagem') as HTMLDivElement | null;

  if (!form || !mensagemDiv) {
    console.error('Form or message div not found');
    return;
  }
  form.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const elements = form.elements;
    const data: Record<string, any> = {};

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i] as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      if (!el.name) continue;
      const val = el.value;
      if (el.type === 'number' && val !== '') {
        data[el.name] = Number(val);
      } else {
        data[el.name] = val;
      }
    }

    fetch(backendAddress + 'blog/umartigo/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    .then(async (response) => {
      if (response.ok) {
        mensagemDiv.innerText = 'Artigo inserido com sucesso!';
        form.reset();
      } else {
        const texto = await response.text();
        mensagemDiv.innerText = 'Erro ao inserir: ' + response.status + ' ' + texto;
      }
    })
    .catch((err) => {
      console.error(err);
      mensagemDiv.innerText = 'Erro de comunicação com o servidor.';
    });
  });
};

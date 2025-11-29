"use strict";
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const token = localStorage.getItem("token");
const fetchConfig = {
    method: "GET",
    headers: {}
};
if (token) {
    fetchConfig.headers = { "Authorization": "Token " + token };
}
fetch(backendAddress + "blog/umartigo/" + id + "/", fetchConfig)
    .then(async (resp) => {
    if (resp.status === 401) {
        alert("Você precisa estar logado para ver este artigo.");
        window.location.href = "../login.html";
        return null;
    }
    if (!resp.ok) {
        const txt = await resp.text();
        alert("Erro ao carregar artigo: " + resp.status + "\n" + txt);
        return null;
    }
    return resp.json();
})
    .then(result => {
    if (!result)
        return;
    if (!result.dados) {
        alert("Erro: dados do artigo não encontrados.");
        return;
    }
    const artigo = result.dados;
    document.getElementById("titulo").innerText = artigo.titulo;
    document.getElementById("conteudo").innerText = artigo.conteudo;
    document.getElementById("autor").innerText = artigo.autor;
    document.getElementById("data").innerText = artigo.data_publicacao;
    if (result.est_autor === true) {
        const btn = document.getElementById("botaoUpdate");
        btn.style.display = "inline-block";
        btn.onclick = () => {
            window.location.href = "update.html?id=" + artigo.id;
        };
    }
})
    .catch(error => {
    console.error("Erro de comunicação:", error);
    alert("Erro ao comunicar com o servidor.");
});

MeuBlog - Projeto de Programação Web

Membros do grupo:

Thomas Tabart

Neste repositório você só precisa do projeto Blog !

1. Escopo do site

MeuBlog é um site de blog multiusuário onde os usuários podem:

  - Consultar artigos (sobre o tema viagem, com por exemplo, relatos de viagem, dicas para planejar viagens etc.)

  - Ler artigos com seus comentários e respostas.

  - Publicar artigos (se for um autor)

  - Publicar comentários (se estiver conectado)

  - Login, Logout, trocar seu senha

  - Resetar sua senha via email

2. Funcionamento do site (manual de utilização)
2.1 Acessar o site

Abra o backend em um navegador no endereço:
https://thomast527.pythonanywhere.com

Abra o frontend em um navegador no endereço:
https://thomast527.github.io/INF1407-Trabalho2-Frontend/

2.2 Navegação

A página inicial explica o objetivo do site.

Uma barra de navegação está disponível no topo de cada página, permitindo navegar entre as diferentes seções do site.

Inicialmente, você chega na homepage. A partir da barra de navegação no topo, você pode acessar a página para criar uma conta ou fazer login.

Se estiver conectado, você pode acessar a página que lista os artigos

Na página que lista os artigos, um autor pode clicar em um botão para criar um novo artigo ou deletar seus artigos. 

Qualquer pessoa conectada pode clicar em um artigo para lê-lo em detalhes. 

2.3 Usuários Leitores / Autores

Existem dois grupos gerenciados pelos administradores: Autores e Leitores.
Um usuário que cria uma conta é une Leitore

Para criar um artigo ou responder a um comentário, é necessário estar conectado.

Autores podem criar, modificar e excluir seus artigos.

O administrator precicsa adicionar manualmente o usuário ao grupo Escritor e Leitor. Administradores também podem modificar e deletar qualquer artigo e gerenciar usuários e grupos.

2.4 Gestão de conta

  - Criar uma conta via formulário de registro.

  - Trocar seu senha

  - Resetar a senha usando a opção "Esqueci minha senha".

3. Funcionalidades que funcionaram

  - Criação e gestão de contas de usuários: registro, login, logout.

  - Gestão de senha: reset via email e alteração de senha.

  - Criação, edição e exclusão de artigos pelos autores.

  - Exibição correta de datas e autores em cada artigo

  - Gestão de grupos de usuários (Leitores, Autores) pelo admin.

4. Limitações / Funcionalidades não implementadas

  - Autores e leitores aprovados precisam ser adicionados manualmente ao grupo Autores pelo administrador (pode ser melhorado).

  - O site não foi testado em todos os navegadores ou dispositivos móveis.

  - Tentei dar alguma importância à segurança do meu site, mas talvez ela ainda possa ser melhorada.

  - Comentario

  - uma página pessoal listando os artigos de um autor

5. Acessar o site

  - Backend via PythonAnywhere: https://thomast527.pythonanywhere.com
  - Frontend via https://thomast527.github.io/INF1407-Trabalho2-Frontend

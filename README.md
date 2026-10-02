# PPComp IFES

Site estático publicado pelo GitHub Pages em `https://ppcomp-ifes.github.io/`.

## Rotas

- `/` — portal de documentação
- `/status/` — status dinâmico dos computadores da sala 902T
- `/vpn/` — solicitação de acesso remoto e configuração da VPN
- `/nix/` — tutoriais de Nix/NixOS
- `/templates/` — modelos reutilizáveis

As páginas são arquivos HTML independentes; CSS, JavaScript, imagens e downloads ficam na raiz do repositório. Os caminhos iniciados por `/` são relativos ao domínio principal do GitHub Pages.

O painel de status carrega dados das planilhas públicas definidas em `scrips.js`. Para visualizar o status completo, a planilha precisa permanecer publicada e acessível.

## Adicionar um template

A biblioteca contém versões `flake.nix` e `shell.nix` para Python 3.13, uv e CUDA/PyTorch, além de modelos com VS Code, Git, NVIDIA/CUDA e Miniconda. Para adicionar outro, crie um fragmento HTML em `templates/items/` com um `.accordion-item` e os atributos `data-tags`, depois inclua o caminho em `templates/index.html`. Os filtros e o botão de cópia ficam em `templates/js/templates.js`.

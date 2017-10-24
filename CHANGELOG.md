# CHANGELOG

## unstable

## 0.2.3
* Manutenção: Adicionada licença sobre código.
* Testes: Criados testes para Toolbar.
* Refatoração: Refatorado acesso à barra lateral e testes.
* Testes: Testes e mudanças em Decorator de $state.
* Issue 91: Corrigido erro no console após login do usuário.

## 0.2.2
* Issue 82: Corrigida validação da mostragem do botão do menu de Local.

## 0.2.1
* Refatoração: Adicionada verificação para o botão "Go Home" ser clicável.
* Refatoração: Traduzidos textos dos botões de entrar e sair da aplicação.
* Refatoração: Mudado local para designar título à reserva.
* Manutenção: Adicionado limites para horário de início e fim do calendário de acordo com o horário de funcionamento do local.
* Issue 71: Corrigido nome de "Auditório" para "Local" na visualização da agenda de um local.
* Issue 60: Corrigida atualização de reservas na agenda.
* Manutenção: Horário de fim da reserva agora inicia preenchido no modal de criação da mesma.

## 0.2.0
* Manuteção: Mudado design do modal de reserva.
* Refatoração: Adicionado state para a agenda dos locais (agora é possível compartilhar o link da agenda de um local).
* Correção: Corrigido link para termos do local no modal de reserva.
* Funcionalidade: Adicionado script para backup do banco de dados.
* Funcionalidade: Reservas passadas agora tem a cor cinza e não são editáveis.
* Correção: Agora não é mais possível cadastrar reservas em horários passados.
* Issue 33: Corrigido cadastro de reserva para caso em que reserva ficava cadastrada no dia anterior.
* Funcionalidade: Adcionada função de definir a imagem de capa de um local.
* Refatoração: A diretiva utilizada para exibição das imagens do local foi trocada por uma mais robusta.
* Correção: Adicionado botão de voltar em edição e visualização de local e corrigida toolbar.

## 0.1.0
* Funcionalidade: Adicionados tipos "Outro" e "Palestra" para Reserva.
* Correção: Corrigido tipo de Reserva "Assembleia".
* Funcionalidade: Adicionada exibição de reservas de acordo com o auditório selecionado.
* Funcionalidade: Adicionada função de abrir modal de reserva com horário de início preenchido.
* Funcionalidade: Adicionada confirmação sobre termos de Local para criação de Reserva.
* Funcionalidade: Adicionada opção de upload de imagem para local.
* Manutenção: Limpeza da suite de testes do frontend e adicionada cobertura de testes no mesmo.
* Funcionalidade: Adicionada validação de permissão ao criar e alterar reservas no servidor.
* Correção: Corrigidos testes no servidor com mudança de Secret do Auth0.
* Funcionalidade: Adicionada validação para tamanho e formato da imagem de upload.
* Funcionalidade: Adicionado modal com informações sobre os desenvolvedores e links para github.
* Correção: Adicionada validação para intervalo em funcionamento de local.
* Funcionalidade: Adicionada visualização de imagens do local e modal para visualização da imagem 'full size'.
* Funcionalidade: Adicionada deleção de imagens do local.
* Funcionalidade: Adicionada verificação da permissão do usuário para criar reserva.
* Funcionalidade: Adicionada função de fechar o modal da reserva após a criação da mesma.
* Funcionalidade: Adicionada identificação para Administradores.
* Funcionalidade: Adicionada deleção de imagem antes de seu salvamento.

## 0.0.2
* Início versionamento.

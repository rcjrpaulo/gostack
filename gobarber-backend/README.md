# Features / Funcionalidades

## Recuperação de Senha

**RF (Requisitos Funcionais)**

- O usuário deve poder recuperar sua senha informando o seu email;
- O usuário deve receber um e-mail com instruções de recuperação de senha;
- O usuário deve poder resetar sua senha;

**RNF (Requisitos Não Funcionais)**

- Utilizar Mailtrap para testar envios em ambiente de dev;
- Utilizar Amazon SES para envios em produção;
- O envio de e-mails deve acontecer em segundo plano (background jog);

**RN (Regras de Negócio)**

- O link enviado por e-mail para resetar senha, deve expirar em 2h;
- O usuário precisa confirmar a nova senha ao resetar sua senha;

## Atualização de Perfil

**RF (Requisitos Funcionais)**

- O usuário deve poder atualizar o seu nome, e-mail e senha


**RN (Regras de Negócio)**

- O usuário não pode alterar seu e-mail para um e-mail já utilizado;
- Para atualizar sua senha, o usuário deve informar a senha antiga;
- Para atualizar sua senha, o usuário precisa confirmar a nova senha;

## Painel do Prestador

**RF (Requisitos Funcionais)**

- O usuário deve poder listar seus agendamentos de um dia específico;
- O prestador deve receber uma notificação sempre que houver um novo agendamento;
- O prestador deve oider visualizar as notificações não lidas;

**RNF (Requisitos Não Funcionais)**

- Os agendamentos do prestador no dia devem ser armazenados em cache;
- As notificações do prestador devem ser armazenadas no MongoDB;
- AS notificações do prestador devem ser enviadas em tempo-real utilizando Socket.io;

**RN (Regras de Negócio)**

- A listagem de agendamentos deve ser apenas do prestador logado;

## Agendamento de Serviços

**RF (Requisitos Funcionais)**

- O usuário deve poder listar todos prestadores de serviço cadastrados;
- O usuário deve poder listar os dias de um mês com pelo menos um horário  disponível de um prestador;
- O usuário deve poder listar horários disponíveis em um dia específico de um prestador;
- O usuário deve poder realizar um novo agendamento com um prestador;

**RNF (Requisitos Não Funcionais)**

- A listagem de prestadores deve ser armazenada em cache;

**RN (Regras de Negócio)**

- Cada agendamento deve durar 1h exatamente;
- Os agendamentos devem estar disponíveis entre 8h às 18h (primeiro as 8h, último às 17h);
- O usuáio não pode agendar em um horário já ocupado;
- O usário nõa pode agendar em um horário que já passou;
- O usuário não pode agendar serviços consigo mesmo;

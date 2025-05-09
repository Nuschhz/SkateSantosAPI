# Skate Santos API

## Descrição

Esta API foi desenvolvida para o sistema de aluguel de skates. Com ela, é possível inserir dados, receber dados dos usuários, controlar créditos no aplicativo, adicionar novos skates, gerar histórico de uso do skate por usuário, entre outras funcionalidades.

Este projeto é parte do Trabalho de Conclusão de Curso (TCC) da Universidade Santa Cecília.

## Instalação

Para instalar todas as bibliotecas necessárias, execute o seguinte comando no diretório raiz:

```sh
npm install
```

## Uso

### Itens

- GET /api/itens/:id - Retorna os dados de um item específico pelo ID.

- POST /api/itens/ - Cria um skate no banco de dados.

### Estações

- GET /api/stations/ - Lista as estações para guardar skates.

- POST /api/stations/ - Cria uma estação para guardar skates.

- POST /api/stations/move-skate - Move o skate alugado de uma estação inicial para uma estação final.

- POST /api/stations/add-skate - Adiciona um skate que ainda não está ativo.

- DELETE /api/stations/:id - Deleta uma estação com base no ID.

### Alugueis

- GET /api/rentals/ - Retorna o histórico de aluguéis de todos os usuários.

- GET /api/rentals/:id - Retorna o histórico de aluguéis de um usuário específico.

- POST /api/rentals/ - Cria um aluguel para que um usuário associe a si mesmo. Esse aluguel retorna todos os dados da transação do início ao fim do uso do skate.

- PATCH /api/rentals/:id - Atualiza o aluguel de um usuário, calculando o número de créditos que será subtraído da sua conta e finalizando a transação.

- DELETE /api/rentals/:id - Deleta o aluguel de um usuário.

### Usuários

- POST /api/users/register - Registra um usuário no banco de dados FIREBASE.

- GET /api/users/ - Lista todos os usuários registrados no banco de dados.

- GET /api/users/id/:id - Retorna os dados de um usuário específico pelo ID.

- GET /api/users/email/:email - Retorna os dados de um usuário específico pelo email.

- PATCH /api/update-user/:id - Atualiza os dados de um usuário, como foto, email ou senha.

- PATCH /api/add-credits/:id - Atualiza os créditos de um usuário.

- PATCH /api/update-strikes/:id - Atualiza o número de strikes de um usuário. Com 3 strikes, ele não pode fazer mais aluguéis novos.

- DELETE /api/users/:id - Deleta um usuário do banco de dados pelo ID.

### Tickets

- POST /api/tickets/ - Registra uma mensagem para a empresa no banco de dados FIREBASE.

- GET /api/tickets/ - Lista todos os tickets registrados no banco de dados.

- PATCH /api/tickets/:id - Atualiza o status de um ticket.

## Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

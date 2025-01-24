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
- POST /api/itens/ - Cria um skate no banco de dados.

### Estações
- POST /api/stations/ - Cria uma estação para guardar skates.

- POST /api/stations/move-skate - Move o skate alugado de uma estação inicial para uma estação final.

- POST /api/stations/add-skate - Adiciona um skate que ainda não está ativo.

### Alugueis
- POST /api/rentals/ - Cria um aluguel para que um usuário associe a si mesmo. Esse aluguel retorna todos os dados da transação do início ao fim do uso do skate.

- GET /api/rentals/:id - Retorna o histórico de aluguéis de um usuário específico.

- PATCH /api/rentals/:id - Atualiza o aluguel de um usuário, calculando o número de créditos que será subtraído da sua conta e finalizando a transação.

- DELETE /api/rentals/:id - Deleta o aluguel de um usuário.

### Usuários
- POST /api/users/register - Registra um usuário no banco de dados FIREBASE.

- GET /api/users/ - Lista todos os usuários registrados no banco de dados.

- GET /api/users/:id - Retorna os dados de um usuário específico.

- PATCH /api/update-user/:id - Atualiza os dados de um usuário, como foto, email ou senha.

- PATCH /api/add-credits/:id - Atualiza os créditos de um usuário.

- PATCH /api/update-strikes/:id - Atualiza o número de strikes de um usuário. Com 3 strikes, ele não pode fazer mais aluguéis novos.

- DELETE /api/users/:id - Deleta um usuário do banco de dados pelo ID.

## Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

# Sistema de Gerenciamento de Estacionamento SENAI

## 📝 Descrição
Sistema desenvolvido para gerenciar o estacionamento do SENAI, permitindo o controle de entrada e saída de veículos, gestão de usuários e geração de relatórios.

## 🚀 Funcionalidades

### Autenticação e Usuários
- Login com CPF e senha
- Cadastro de usuários (alunos, professores, funcionários e administradores)
- Gerenciamento de perfis de acesso

### Veículos
- Registro de veículos por usuário
- Vinculação de veículos aos proprietários
- Consulta de veículos cadastrados

### Estacionamento
- Controle de entrada e saída de veículos
- Monitoramento de vagas disponíveis
- Registro de tempo de permanência

### Relatórios
- Histórico de utilização por veículo
- Relatórios de ocupação
- Controle de acesso

## 🛠️ Tecnologias Utilizadas
- Node.js
- Express
- Sequelize (PostgreSQL)
- JWT para autenticação
- BCrypt para criptografia
- Express Validator

## ⚙️ Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o arquivo `.env`:
```
DATABASE_URL=sua_url_do_banco_de_dados
JWT_SECRET=seu_segredo_jwt
```

4. Inicie o servidor:
```bash
npm start
```

## 🔑 Rotas da API

### Autenticação
- `POST /auth/login` - Login de usuário
- `POST /auth/cadastro` - Cadastro de novo usuário

### Usuários
- `GET /usuario` - Listar informações do usuário
- `GET /usuario/todos` - Listar todos os usuários (admin/funcionário)
- `PUT /usuario/:id` - Atualizar usuário
- `DELETE /usuario/:id` - Deletar usuário

### Veículos
- `GET /veiculo` - Listar veículos do usuário
- `POST /veiculo` - Cadastrar novo veículo
- `PUT /veiculo/:id` - Atualizar veículo
- `DELETE /veiculo/:id` - Remover veículo

### Relatórios
- `GET /relatorio` - Listar relatórios do usuário
- `POST /relatorio/entrada` - Registrar entrada
- `PUT /relatorio/saida/:id` - Registrar saída

## 👥 Níveis de Acesso
- **Admin**: Acesso total ao sistema
- **Funcionário**: Gerenciamento de entradas/saídas
- **Professor/Aluno**: Gerenciamento dos próprios veículos

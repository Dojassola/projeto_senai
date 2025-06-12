# Documentação de Endpoints da API

## Endpoints de Autenticação
| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| POST | `/auth/login` | Login de usuário | Público |
| POST | `/auth/cadastro` | Registrar novo usuário | Admin |

## Endpoints de Usuário
| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| GET | `/usuario` | Listar todos os usuários | Admin, Funcionário |
| GET | `/usuario/:id` | Obter usuário específico | Admin, Funcionário |
| POST | `/usuario` | Criar novo usuário | Admin, Funcionário |
| PUT | `/usuario/:id` | Atualizar usuário | Admin, Funcionário, Próprio |
| DELETE | `/usuario/:id` | Excluir usuário | Admin, Funcionário, Próprio |

## Endpoints de Veículo
| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| GET | `/veiculo` | Listar veículos do usuário | Autenticado |
| GET | `/veiculo/:id` | Obter veículo específico | Admin, Funcionário |
| POST | `/veiculo` | Registrar novo veículo | Admin, Funcionário |
| PUT | `/veiculo/:id` | Atualizar veículo | Admin, Funcionário |
| DELETE | `/veiculo/:id` | Excluir veículo | Admin, Funcionário |

## Endpoints de Relatório
| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| GET | `/relatorio` | Listar relatórios | Autenticado |
| POST | `/relatorio/entrada` | Registrar entrada de veículo | Admin, Funcionário |
| PUT | `/relatorio/saida/:id` | Registrar saída de veículo | Admin, Funcionário |
| DELETE | `/relatorio/:id` | Excluir relatório | Admin |
| PUT | `/relatorio/:id` | Atualizar relatório | Admin |

## Endpoints de Estacionamento
| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| GET | `/estacionamento` | Listar estacionamentos | Autenticado |
| GET | `/estacionamento/vagas/:id` | Obter vagas disponíveis | Autenticado |
| GET | `/estacionamento/:id` | Obter estacionamento específico | Admin, Funcionário |
| POST | `/estacionamento` | Criar estacionamento | Admin |
| PUT | `/estacionamento/:id` | Atualizar vagas | Admin, Funcionário |

## Funções Especiais
| Endpoint | Descrição | Campos Necessários |
|----------|-----------|--------------------|
| `/auth/login` | Autenticação | `cpf`, `senha` |
| `/auth/cadastro` | Registro de Usuário | `nome`, `cpf`, `senha`, `funcao` |
| `/relatorio/entrada` | Registro de Entrada | `veiculo_id` ou `placa` |
| `/relatorio/saida/:id` | Registro de Saída | ID do veículo na URL |
| `/veiculo` | Registro de Veículo | `placa`, `donoId` |
| `/estacionamento` | Criação de Estacionamento | `vagas` |

## Níveis de Acesso
- **Admin**: Acesso total ao sistema
- **Funcionário**: Pode gerenciar entradas/saídas e operações básicas de usuários
- **Professor/Aluno**: Pode gerenciar apenas seus próprios veículos e visualizar seus relatórios
- **Autenticado**: Acesso básico requerendo token JWT válido

## Códigos de Resposta
- 200: Sucesso
- 201: Criado
- 204: Sem Conteúdo (exclusão bem-sucedida)
- 400: Requisição Inválida
- 401: Não Autorizado
- 403: Proibido
- 404: Não Encontrado
- 409: Conflito
- 500: Erro Interno do Servidor

# API Endpoints Documentation

## Authentication Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/auth/login` | User login | Public |
| POST | `/auth/cadastro` | Register new user | Admin |

## User Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/usuario` | List all users | Admin, Funcionario |
| GET | `/usuario/:id` | Get specific user | Admin, Funcionario |
| POST | `/usuario` | Create new user | Admin, Funcionario |
| PUT | `/usuario/:id` | Update user | Admin, Funcionario, Self |
| DELETE | `/usuario/:id` | Delete user | Admin, Funcionario, Self |

## Vehicle Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/veiculo` | List user's vehicles | Authenticated |
| GET | `/veiculo/:id` | Get specific vehicle | Admin, Funcionario |
| POST | `/veiculo` | Register new vehicle | Admin, Funcionario |
| PUT | `/veiculo/:id` | Update vehicle | Admin, Funcionario |
| DELETE | `/veiculo/:id` | Delete vehicle | Admin, Funcionario |

## Report Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/relatorio` | List reports | Authenticated |
| POST | `/relatorio/entrada` | Register vehicle entry | Admin, Funcionario |
| PUT | `/relatorio/saida/:id` | Register vehicle exit | Admin, Funcionario |
| DELETE | `/relatorio/:id` | Delete report | Admin |
| PUT | `/relatorio/:id` | Update report | Admin |

## Parking Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/estacionamento` | List parking lots | Authenticated |
| GET | `/estacionamento/vagas/:id` | Get available spots | Authenticated |
| GET | `/estacionamento/:id` | Get specific parking lot | Admin, Funcionario |
| POST | `/estacionamento` | Create parking lot | Admin |
| PUT | `/estacionamento/:id` | Update parking spots | Admin, Funcionario |

## Special Functions
| Endpoint | Description | Required Fields |
|----------|-------------|-----------------|
| `/auth/login` | Authentication | `cpf`, `senha` |
| `/auth/cadastro` | User Registration | `nome`, `cpf`, `senha`, `funcao` |
| `/relatorio/entrada` | Entry Registration | `veiculo_id` or `placa` |
| `/relatorio/saida/:id` | Exit Registration | Vehicle ID in URL |
| `/veiculo` | Vehicle Registration | `placa`, `donoId` |
| `/estacionamento` | Parking Lot Creation | `vagas` |

## Access Levels
- **Admin**: Full system access
- **Funcionario**: Can manage entries/exits and basic user operations
- **Professor/Aluno**: Can only manage their own vehicles and view their reports
- **Authenticated**: Basic access requiring valid JWT token

## Response Codes
- 200: Success
- 201: Created
- 204: No Content (successful deletion)
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error

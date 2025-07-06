import axios from 'axios'
import { describe, it, expect, beforeAll } from 'vitest'

const baseURL = 'http://localhost:3000'

let tokenAdmin = ''
let usuarioCriadoId = null

beforeAll(async () => {
  // login real do admin
  const res = await axios.post(`${baseURL}/auth/login`, {
    cpf: '11111111111',
    senha: 'admin'
  })
  tokenAdmin = res.data.token
})

describe('Testes API - Usuários', () => {
  it('Deve listar todos os usuários (admin)', async () => {
    const res = await axios.get(`${baseURL}/usuario/todos`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    })
    expect(res.status).toBe(200)
    expect(Array.isArray(res.data)).toBe(true)
  })

  it('Deve criar um novo usuário (admin)', async () => {
    const novoUsuario = {
      nome: 'Teste Usuário',
      cpf: `576.797.130-73`, // CPF válido
      senha: 'senha123456',
      funcao: 'aluno'
    }
    const res = await axios.post(`${baseURL}/usuario`, novoUsuario, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    })
    expect(res.status).toBe(201)
    expect(res.data).toHaveProperty('id')
    expect(res.data.nome).toBe(novoUsuario.nome)
    usuarioCriadoId = res.data.id
  })

  it('Deve buscar usuário pelo ID (admin)', async () => {
    const res = await axios.get(`${baseURL}/usuario/${usuarioCriadoId}`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    })
    expect(res.status).toBe(200)
    expect(res.data.id).toBe(usuarioCriadoId)
  })

  it('Deve deletar usuário criado (admin)', async () => {
    const res = await axios.delete(`${baseURL}/usuario/${usuarioCriadoId}`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    })
    expect(res.status).toBe(204)
  })
})

import axios from 'axios';
import { describe, it, expect, beforeAll} from 'vitest';

const baseURL = 'http://localhost:3000';
let tokenAdmin = '';
let veiculoId = null;

beforeAll(async () => {
  const res = await axios.post(`${baseURL}/auth/login`, {
    cpf: '11111111111',
    senha: 'admin'
  });
  tokenAdmin = res.data.token;
});

describe('Testes de Veículos', () => {
  it('Deve criar um veículo', async () => {
    const placa = `XYZ${Math.floor(Math.random() * 10000)}`;
    const res = await axios.post(`${baseURL}/veiculo`, { placa }, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty('placa', placa);
    veiculoId = res.data.id;
  });

  it('Deve buscar o veículo criado por ID', async () => {
    const res = await axios.get(`${baseURL}/veiculo/${veiculoId}`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    expect(res.status).toBe(200);
    expect(res.data.id).toBe(veiculoId);
  });

  it('Deve listar os veículos do usuário logado', async () => {
    const res = await axios.get(`${baseURL}/veiculo`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });

  it('Deve listar todos os veículos do sistema', async () => {
    const res = await axios.get(`${baseURL}/veiculo/todos`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });

  it('Deve atualizar os dados do veículo', async () => {
    const novaPlaca = `UPD${Math.floor(Math.random() * 10000)}`;
    const res = await axios.put(`${baseURL}/veiculo/${veiculoId}`, {
      placa: novaPlaca
    }, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    expect(res.status).toBe(200);
    expect(res.data.placa).toBe(novaPlaca);
  });

  it('Deve deletar o veículo', async () => {
    const res = await axios.delete(`${baseURL}/veiculo/${veiculoId}`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    expect(res.status).toBe(204);
  });

  it('Deve retornar 404 ao buscar veículo deletado', async () => {
    try {
      await axios.get(`${baseURL}/veiculo/${veiculoId}`, {
        headers: { Authorization: `Bearer ${tokenAdmin}` }
      });
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });
});

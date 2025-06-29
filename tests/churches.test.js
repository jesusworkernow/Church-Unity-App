// tests/churches.test.js - Example Jest test for churches API
const request = require('supertest');
const express = require('express');
const churchRoutes = require('../routes/churches');

const app = express();
app.use(express.json());
app.use('/api/churches', churchRoutes);

describe('Churches API', () => {
  it('should return 400 if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/churches')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});

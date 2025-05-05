jest.setTimeout(30000);

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import cookieParser from 'cookie-parser';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let userId: number;
  let cookie: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser(process.env.JWT_SECRET || 'secret-example'));

    await app.init();

    server = app.getHttpServer();

    const res = await request(server)
      .post('/auth/register')
      .send({
        name: 'Admin',
        email: `admin${Date.now()}@email.com`,
        password: '123456',
      });

    console.log('status:', res.status);
    console.log('headers:', res.headers);

    if (res.status !== 201) {
      throw new Error(`Register error. Status: ${res.status}`);
    }

    const cookies = res.headers['set-cookie'];
    if (!cookies || !cookies.length) {
      throw new Error('Cookie not returned from backend');
    }

    cookie = cookies[0];
    expect(cookie).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a user (POST /users)', async () => {
    const res = await request(server)
      .post('/users')
      .set('Cookie', cookie)
      .send({ name: 'Davi', email: 'davi@email.com', password: '12345' })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Davi');
    expect(res.body.email).toBe('davi@email.com');
    expect(res.body).not.toHaveProperty('password');
    userId = res.body.id;
  });

  it('should return all users (GET /users)', async () => {
    const res = await request(server)
      .get('/users')
      .set('Cookie', cookie)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should return user by ID (GET /users/:id)', async () => {
    const res = await request(server)
      .get(`/users/${userId}`)
      .set('Cookie', cookie)
      .expect(200);

    expect(res.body.id).toBe(userId);
  });

  it('should update the user (PUT /users/:id)', async () => {
    const res = await request(server)
      .put(`/users/${userId}`)
      .set('Cookie', cookie)
      .send({ name: 'Atualizado', email: 'novo@email.com' })
      .expect(200);

    expect(res.body.name).toBe('Atualizado');
  });

  it('should delete the user (DELETE /users/:id)', async () => {
    await request(server)
      .delete(`/users/${userId}`)
      .set('Cookie', cookie)
      .expect(200);
  });
});

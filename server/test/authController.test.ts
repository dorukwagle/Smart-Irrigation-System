import { describe, it, expect, beforeEach, afterEach, afterAll, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { hashPassword } from '@/utils/hash';
import prismaClient from '@/utils/prismaClient';
import clearDb from './clearDb';

describe('AuthController', () => {
  const loginUrl = '/api/auth/login';
  const testUser = {
    username: 'testuser',
    password: 'password123',
    fullName: 'Test User'
  };

  beforeAll(async () => {
    // Connect to the test database
    await prismaClient.$connect();
  });

  afterAll(async () => {
    // Disconnect from the test database
    await prismaClient.$disconnect();
  });

  beforeEach(async () => {
    // Create a test user
    await prismaClient.users.create({
      data: {
        username: testUser.username,
        password: await hashPassword(testUser.password),
        fullName: testUser.fullName
      },
    });
  });

  afterEach(async () => {
    // Clean up after each test
    await clearDb();
  });

  describe('POST /login', () => {
    it('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post(loginUrl)
        .send({ username: testUser.username, password: testUser.password });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('username', testUser.username);
    });

    it('should fail login with incorrect credentials', async () => {
      const response = await request(app)
        .post(loginUrl)
        .send({ username: testUser.username, password: 'wrongPassword' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Incorrect');
    });

    it('should set sessionId header on successful login', async () => {
      const response = await request(app)
        .post(loginUrl)
        .send({ username: testUser.username, password: testUser.password });

      expect(response.status).toBe(200);
      expect(response.headers['set-cookie']).toBeTruthy();
      expect(response.headers['set-cookie'][0]).toContain('sessionId');
    });
  });
});

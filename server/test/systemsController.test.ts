import { describe, it, expect, beforeEach, afterEach, afterAll, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { hashPassword } from '@/utils/hash';
import prismaClient from '@/utils/prismaClient';
import clearDb from './clearDb';

describe('SystemsController', () => {
  const registerUrl = '/api/systems/register';
  const loginUrl = '/api/auth/login';
  
  const testUser = {
    username: 'testuser',
    password: 'password123',
    fullName: 'Test User'
  };

  const validSystem = {
    systemName: 'Test System',
    pumpFlowRate: 10.5
  };

  let authCookie: string;

  beforeAll(async () => {
    // Connect to the test database
    await prismaClient.$connect();
    await clearDb();
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

    // Login to get session cookie
    const loginResponse = await request(app)
      .post(loginUrl)
      .send({ username: testUser.username, password: testUser.password });

    // Extract the session cookie for authenticated requests
    authCookie = loginResponse.headers['set-cookie'][0];
  });

  afterEach(async () => {
    // Clean up after each test
    await clearDb();
  });

  describe('POST /register', () => {
    it('should throw validation error if not all required fields are given', async () => {
      // Missing pumpFlowRate
      const response = await request(app)
        .post(registerUrl)
        .set('Cookie', authCookie)
        .send({ systemName: 'Test System' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('pumpFlowRate');
      expect(response.body.pumpFlowRate[0]).toContain('Expected');
    });

    it('should throw validation error if systemName is too short', async () => {
      const response = await request(app)
        .post(registerUrl)
        .set('Cookie', authCookie)
        .send({ systemName: 'Te', pumpFlowRate: 10.5 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('systemName');
      expect(response.body.systemName[0]).toContain('characters');
    });

    it('should throw validation error if pumpFlowRate is too low', async () => {
      const response = await request(app)
        .post(registerUrl)
        .set('Cookie', authCookie)
        .send({ systemName: 'Test System', pumpFlowRate: 0.05 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('pumpFlowRate');
      expect(response.body.pumpFlowRate[0]).toContain('0.1L/min');
    });

    it('should register the system if all fields are given correctly', async () => {
      const response = await request(app)
        .post(registerUrl)
        .set('Cookie', authCookie)
        .send(validSystem);

      expect(response.status).toBe(200);
      expect(response.body[0]).toHaveProperty('systemName', validSystem.systemName);
      expect(response.body[0]).toHaveProperty('pumpFlowRate', validSystem.pumpFlowRate);
      expect(response.body[0]).toHaveProperty('identifier');
    });

    it('should save the system in database once registration is successful', async () => {
      // Register a system
      await request(app)
        .post(registerUrl)
        .set('Cookie', authCookie)
        .send(validSystem);

      // Check if the system exists in the database
      const systems = await prismaClient.systems.findMany({
        where: {
          systemName: validSystem.systemName,
        },
      });

      expect(systems.length).toBe(1);
      expect(systems[0]).toHaveProperty('systemName', validSystem.systemName);
      expect(systems[0]).toHaveProperty('pumpFlowRate', validSystem.pumpFlowRate);
      
      // Check if related records were created
      const preferences = await prismaClient.systems.findFirst({
        where: {
          systemId: systems[0].systemId,
        },
      });
      expect(preferences).toBeTruthy();

      const liveStatus = await prismaClient.liveStatus.findFirst({
        where: {
          systemId: systems[0].systemId,
        },
      });
      expect(liveStatus).toBeTruthy();

      const session = await prismaClient.systemSessions.findFirst({
        where: {
          systemId: systems[0].systemId,
        },
      });
      expect(session).toBeTruthy();
      expect(session).toHaveProperty('systemIdentifier');
    });
  });
});

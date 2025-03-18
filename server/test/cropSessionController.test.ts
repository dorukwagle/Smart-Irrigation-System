import { describe, it, expect, beforeEach, afterEach, afterAll, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { hashPassword } from '@/utils/hash';
import prismaClient from '@/utils/prismaClient';
import clearDb from './clearDb';
import { CROP_TYPES } from '@/entities/constants';

describe('CropSessionController', () => {
  const loginUrl = '/api/auth/login';
  
  // Test user for authentication
  const testUser = {
    username: 'testuser',
    password: 'password123',
    fullName: 'Test User'
  };

  // Test system for creating crop sessions
  const testSystem = {
    systemName: 'Test System',
    pumpFlowRate: 10.5
  };

  // Valid crop session data
  const validCropSession = {
    cropName: CROP_TYPES[0], // Using the first crop type from the constants
    ageCount: 5
  };

  let authCookie: string;
  let systemId: string;

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
    const user = await prismaClient.users.create({
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

    // Create a test system
    const systemResponse = await request(app)
      .post('/api/systems/register')
      .set('Cookie', authCookie)
      .send(testSystem);

    // Extract the system ID for creating crop sessions
    systemId = systemResponse.body[0].systemId;
  });

  afterEach(async () => {
    // Clean up after each test
    await clearDb();
  });

  describe('POST /:systemId', () => {
    const getUrl = (id: string) => `/api/crop-sessions/${id}`;

    it('should throw validation error if cropName is missing', async () => {
      const response = await request(app)
        .post(getUrl(systemId))
        .set('Cookie', authCookie)
        .send({ ageCount: 5 }); // Missing cropName

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('cropName');
      expect(response.body.cropName[0]).toContain('required');
    });

    it('should throw validation error if ageCount is missing', async () => {
      const response = await request(app)
        .post(getUrl(systemId))
        .set('Cookie', authCookie)
        .send({ cropName: CROP_TYPES[0] }); // Missing ageCount

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('ageCount');
      expect(response.body.ageCount[0]).toContain('Expected');
    });

    it('should throw validation error if cropName is invalid', async () => {
      const response = await request(app)
        .post(getUrl(systemId))
        .set('Cookie', authCookie)
        .send({ cropName: 'InvalidCrop', ageCount: 5 }); // Invalid crop name

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('cropName');
      expect(response.body.cropName[0]).toContain('Invalid');
    });

    it('should throw validation error if ageCount is negative', async () => {
      const response = await request(app)
        .post(getUrl(systemId))
        .set('Cookie', authCookie)
        .send({ cropName: CROP_TYPES[0], ageCount: -1 }); // Negative age count

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('ageCount');
      expect(response.body.ageCount[0]).toContain('negative');
    });

    it('should create a crop session successfully with valid data', async () => {
      const response = await request(app)
        .post(getUrl(systemId))
        .set('Cookie', authCookie)
        .send(validCropSession);

      expect(response.status).toBe(200);
      expect(response.body[0]).toHaveProperty('cropName', validCropSession.cropName);
      expect(response.body[0]).toHaveProperty('ageCount', validCropSession.ageCount);
      expect(response.body[0]).toHaveProperty('cropSessionId');
      expect(response.body[0]).toHaveProperty('systemId', systemId);
    });

    it('should add the crop session to the database', async () => {
      // Create a crop session
      await request(app)
        .post(getUrl(systemId))
        .set('Cookie', authCookie)
        .send(validCropSession);

      // Check if the crop session exists in the database
      const cropSessions = await prismaClient.cropSessions.findMany({
        where: {
          systemId,
          cropName: validCropSession.cropName,
        },
      });

      expect(cropSessions.length).toBe(1);
      expect(cropSessions[0]).toHaveProperty('cropName', validCropSession.cropName);
      expect(cropSessions[0]).toHaveProperty('ageCount', validCropSession.ageCount);
      expect(cropSessions[0]).toHaveProperty('initialCropAge', validCropSession.ageCount);
      expect(cropSessions[0]).toHaveProperty('lastAgeUpdated');
    });
  });
});

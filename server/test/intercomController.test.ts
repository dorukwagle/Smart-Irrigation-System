import { describe, it, expect, beforeEach, afterEach, afterAll, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import prismaClient from '@/utils/prismaClient';
import clearDb from './clearDb';
import { hashPassword } from '@/utils/hash';

describe('IntercomController', () => {
  // Test system for authentication
  const testSystem = {
    systemName: 'Test System',
    pumpFlowRate: 10.5,
    systemIdentifier: 'test-system-identifier'
  };

  // Valid live status data
  const validLiveStatus = {
    irrigationStatus: 'ON',
    temperature: 25.5,
    humidity: 60.2,
    moisture: 45.8
  };
  const testUser = {
    username: 'testuser',
    password: 'password123',
    fullName: 'Test User'
  };

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
      }
    });

    // Create a test system with identifier
    const system = await prismaClient.systems.create({
      data: {
        systemName: testSystem.systemName,
        pumpFlowRate: testSystem.pumpFlowRate,
        userId: user.userId
      }
    });

    systemId = system.systemId;

    // Create system session with identifier
    await prismaClient.systemSessions.create({
      data: {
        userId: user.userId,
        systemId,
        systemIdentifier: testSystem.systemIdentifier,
        currentSchedule: null
      }
    });

    // Create initial live status
    await prismaClient.liveStatus.create({
      data: {
        systemId,
        irrigationStatus: 'OFF',
        temperature: 20.0,
        humidity: 50.0,
        moisture: 40.0
      }
    });
  });

  afterEach(async () => {
    // Clean up after each test
    await clearDb();
  });

  describe('POST /system/live', () => {
    const url = '/intercom/system/live';

    it('should return 401 if system identifier is missing', async () => {
      const response = await request(app)
        .post(url)
        .send(validLiveStatus);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('identify');
    });

    it('should return 401 if system identifier is invalid', async () => {
      const response = await request(app)
        .post(url)
        .query({ identifier: 'invalid-identifier' })
        .send(validLiveStatus);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('identify');
    });

    it('should return validation error if irrigationStatus is missing', async () => {
      const response = await request(app)
        .post(url)
        .query({ identifier: testSystem.systemIdentifier })
        .send({
          temperature: validLiveStatus.temperature,
          humidity: validLiveStatus.humidity,
          moisture: validLiveStatus.moisture
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
    });

    it('should return validation error if temperature is missing', async () => {
      const response = await request(app)
        .post(url)
        .query({ identifier: testSystem.systemIdentifier })
        .send({
          irrigationStatus: validLiveStatus.irrigationStatus,
          humidity: validLiveStatus.humidity,
          moisture: validLiveStatus.moisture,
          temperature: undefined
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
    });

    it('should return validation error if humidity is missing', async () => {
      const response = await request(app)
        .post(url)
        .query({ identifier: testSystem.systemIdentifier })
        .send({
          irrigationStatus: validLiveStatus.irrigationStatus,
          temperature: validLiveStatus.temperature,
          moisture: validLiveStatus.moisture
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
    });

    it('should return validation error if moisture is missing', async () => {
      const response = await request(app)
        .post(url)
        .query({ identifier: testSystem.systemIdentifier })
        .send({
          irrigationStatus: validLiveStatus.irrigationStatus,
          temperature: validLiveStatus.temperature,
          humidity: validLiveStatus.humidity
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
    });

    it('should return validation error if irrigationStatus is invalid', async () => {
      const response = await request(app)
        .post(url)
        .query({ identifier: testSystem.systemIdentifier })
        .send({
          irrigationStatus: 'INVALID',
          temperature: validLiveStatus.temperature,
          humidity: validLiveStatus.humidity,
          moisture: validLiveStatus.moisture
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
    });

    it('should return success response with valid data', async () => {
      const response = await request(app)
        .post(url)
        .query({ identifier: testSystem.systemIdentifier })
        .send(validLiveStatus);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'success');
    });

    it('should update the database with new live status', async () => {
      // Send the request with valid data
      await request(app)
        .post(url)
        .query({ identifier: testSystem.systemIdentifier })
        .send(validLiveStatus);

      // Check if the live status was updated in the database
      const updatedLiveStatus = await prismaClient.liveStatus.findUnique({
        where: {
          systemId
        }
      });

      expect(updatedLiveStatus).not.toBeNull();
      expect(updatedLiveStatus?.irrigationStatus).toBe(validLiveStatus.irrigationStatus);
      expect(updatedLiveStatus?.temperature).toBe(validLiveStatus.temperature);
      expect(updatedLiveStatus?.humidity).toBe(validLiveStatus.humidity);
      expect(updatedLiveStatus?.moisture).toBe(validLiveStatus.moisture);
    });
  });
});

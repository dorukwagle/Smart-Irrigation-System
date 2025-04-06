import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import prismaClient from "@/utils/prismaClient";
import { v4 as uuidv4 } from "uuid";
import { Sessions } from "@prisma/client";
import request from "supertest";
import app from "../src/app";
import clearDb from "./clearDb";
import { hashPassword } from "@/utils/hash";

let session: Sessions;
let sessionId: string;

beforeAll(async () => {
  // Start the server
  await clearDb();

  // Create test session
  const date = new Date();
  date.setDate(date.getDate() + 1);

  await prismaClient.users.create({
    data: {
      userId: "test-user-id",
      username: "testuser",
      password: await hashPassword("password123"),
      fullName: "Test User"
    }
  });
});

afterAll(async () => {
  await prismaClient.$disconnect();
});

beforeEach(async () => {
  // Create test session
  const date = new Date();
  date.setDate(date.getDate() + 1);

  session = await prismaClient.sessions.create({
    data: {
      userId: "test-user-id", // Replace with actual test user ID
      session: uuidv4(),
      expiresAt: date,
    },
  });

  sessionId = session.session;
});

afterEach(async () => {
  // Cleanup sessions after each test
  await prismaClient.sessions.deleteMany({
    where: {
      userId: "test-user-id",
    },
  });
});

describe("authorization test", () => {
  const req = request(app);

  it("should return 401 if not authorized", async () => {
    const res = await req.get("/api/systems");
    expect(res.status).toBe(401);
    expect(res.body.error).toBeTruthy();
  });
  
  it("should return 401 if invalid session id", async () => {
    const res = await req.get("/api/systems").set("Cookie", `sessionId=${uuidv4()}`);
    expect(res.status).toBe(401);
    expect(res.body.error).toBeTruthy();
  });

  it("should return systems info if valid session is given", async () => {
    const res = await req.get("/api/systems").set("Cookie", `sessionId=${sessionId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
  });

  it("should return 401 if expired session is given", async () => {
    // Make session expire
    const date = new Date();
    date.setDate(date.getDate() - 1);
    await prismaClient.sessions.updateMany({
      where: {
        session: sessionId,
      },
      data: {
        expiresAt: date,
      },
    });

    const res = await req.get("/api/systems").set("Cookie", `sessionId=${sessionId}`);

    expect(res.status).toBe(401);
    expect(res.body.error).toBeTruthy();
  });
});

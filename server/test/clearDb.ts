import prismaClient from "@/utils/prismaClient";

const clearDb = async () => {
    await prismaClient.systemSessions.deleteMany();
    await prismaClient.liveStatus.deleteMany();
    await prismaClient.systemPreferences.deleteMany();
    await prismaClient.systems.deleteMany();
    await prismaClient.sessions.deleteMany();
    await prismaClient.users.deleteMany();

    // await new Promise((resolve) => setTimeout(resolve, 5000));
};

export default clearDb;

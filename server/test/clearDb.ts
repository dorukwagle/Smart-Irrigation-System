import prismaClient from "@/utils/prismaClient";

const clearDb = async () => {
    await prismaClient.sessions.deleteMany();
    await prismaClient.users.deleteMany();
};

export default clearDb;

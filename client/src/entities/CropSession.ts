interface CropSession {
    cropSessionId: string;
    cropName: string;
    initialCropAge: number;
    ageCount: number;
    sessionActive: boolean;
    systemId: string;
    createdAt: Date;
};

export default CropSession;
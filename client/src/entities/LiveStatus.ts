
interface Status {
    updatedAt: Date;
    humidity: number;
    irrigationStatus: "ON" | "OFF";
    moisture: number;
    temperature: number;
};

interface ActiveSession {
    ageCount: number;
    cropName: string;
    initialCropAge: number;
    sessionActive: boolean;
};

interface Schedule {
    createdAt: Date;
    cropAge: number;
    scheduleId: string;
    irrigationStartTime: Date;
    irrigationStopTime: Date;
}

interface LiveStatus {
    manualOverride: boolean;
    liveStatus: Status;
    activeSession: ActiveSession;
    schedules: Schedule[];
};

export default LiveStatus;
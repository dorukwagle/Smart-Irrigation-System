
interface Graph {
    week: number;
    waterUsage: number;
}

interface Schedule {
    scheduleId: string;
    irrigationStartTime: Date;
    irrigationStopTime: Date;
    cropAge: number;
}

interface WaterUsageGraph {
    initialCropAge: number;
    ageCount: number;
    totalWeeks: number;
    graph: Graph[];
    schedules:  Schedule[]
};

export default WaterUsageGraph;
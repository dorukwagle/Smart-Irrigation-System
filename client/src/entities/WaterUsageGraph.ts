
interface Graph {
    week: number;
    waterUsage: number;
}

interface WaterUsageGraph {
    initialCropAge: number;
    ageCount: number;
    totalWeeks: number;
    graph: Graph[];
};

export default WaterUsageGraph;
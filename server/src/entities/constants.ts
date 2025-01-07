const DEFAULT_PAGE_SIZE = Number(process.env.PAGE_SIZE || 9);
const CROP_TYPES: readonly [string, ...string[]] = [
    "Wheat",
    "Groundnuts",
    "Garden Flowers",
    "Maize",
    "Paddy",
    "Potato",
    "Pulse",
    "Sugarcane",
    "Coffee",
];

const AI_SERVER_URL = process.env.AI_SERVER_URL || "http://localhost:1625";

export { DEFAULT_PAGE_SIZE, CROP_TYPES, AI_SERVER_URL };

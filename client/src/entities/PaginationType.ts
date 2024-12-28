interface Info {
    hasNextPage: boolean;
    itemsCount: number;
}

interface PaginationTypes {
    info?: Info
}

export default PaginationTypes;
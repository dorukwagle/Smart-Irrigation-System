import CropSession from "./CropSession";
import PaginationTypes from "./PaginationType";

interface SessionPagination extends PaginationTypes {
    data: CropSession[]
}

export default SessionPagination;
import { MoveToPositionDirection } from "./move-to-position-direction.enum";

export class PostMoveToPosition {
    requestId: string;
    companyId: string;
    branchId: string;
    workflowId: string;
    numberOfPlacesToMove: number;
    direction: MoveToPositionDirection;
}
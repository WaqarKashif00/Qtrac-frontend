import { IQueue } from "../../utility-services/models/agent-signalr/queue.model";
import { KioskRequest } from "../agent-models";

export class MoveToPositionResponse {
    Queue: IQueue;
    Customer: KioskRequest;
}
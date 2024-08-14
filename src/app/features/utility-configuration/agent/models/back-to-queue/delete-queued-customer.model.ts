import { IQueue } from "../../utility-services/models/agent-signalr/queue.model";
import { KioskRequest } from "../agent-models";

export class QueueUpdateResponse {
  queue: IQueue;
  requests: KioskRequest[];
}

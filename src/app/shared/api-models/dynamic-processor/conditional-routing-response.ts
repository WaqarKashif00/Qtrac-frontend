import { ConditionalRoutingResponseTypes } from './conditional-routing-response-type';

export class ConditionalRoutingResponse {
    responseType: ConditionalRoutingResponseTypes;
    queueId: string | null;
    questionSetId: string | null;
    complexity: number;
    request: any
}

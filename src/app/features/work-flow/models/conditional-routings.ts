import { Condition, QuestionSet } from './conditional-events';
import { Routing } from './work-flow-response.interface';

export interface ConditionalRouting{
    id: string;
    routeName: string;
    routing: Routing;
    questionSet: QuestionSet;
    conditionType: string;
    conditions: Condition[];
    isDeleted?: boolean;
}

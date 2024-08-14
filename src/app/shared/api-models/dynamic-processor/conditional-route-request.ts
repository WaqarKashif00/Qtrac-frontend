export class EvaluateConditionalRouteRequest {
    previouslyAskedQuestionSets: string[];
    documents: Array<RulesDocument | RulesDocumentReference>;
}

export class RulesDocument {
    constructor(public documentType: string, public document: any) {

    }
}


export class RulesDocumentReference {
    constructor(public documentType: string, public id: string, public pk: string) {
    }
}

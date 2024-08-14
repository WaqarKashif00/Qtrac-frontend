export enum RequestDocumentType{
    Workflow= "workflow",
    CustomerRequest = "customerRequest"
}

export const AdvanceWorkflowType = [
    { name: "Route", value: "route" },
    { name: "Action", value: "alert" }
]

export const RuleOperationType = [
    { name: "And", value: "and" },
    { name: "Or", value: "or" },
]

export const NoQueue = "No Queue"
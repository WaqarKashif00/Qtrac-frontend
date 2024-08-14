export enum ActionRule {
    NotifyCustomerviaEmail = "Notify Customer via Email",
    NotifyCustomerviaSMS = "Notify Customer via SMS",
    AlertAgentviaApplication = "Alert Agent via Application",
    AlertAgentviaEmail = "Alert Agent via Email",
    AlertAgentviaSMS = "Alert Agent via SMS",
    AddToGroup = "Add to Visitor tag",
    MovePosition = "Move Position",
    HighLightTheVisit = "Highlight the Visit in Queue",
    BCCStore = "BCC Store",
    RouteTo = "Route To",
    AssignPriority = "Assign Priority",
    GenerateReportingEvent = "Generate Reporting Event",
    AddToQueue = "Add to Queue",
    GenerateMonitorAnnouncement = "Generate Monitor Announcement"

}

export enum ActionType {
    SMS = "SMS",
    Email = "Email",
    Group = "Group",
    Alert = "Alert",
    Position = "Position",
    Color = "Color",
    Route = "Route",
    Priority = "Priority",
    ReportingEventAName = "Reporting Event a name",
    RouteToQueue = "Route To Queue",
    Announcement = "Announcement"

}

export enum ActionFor {
    Agent = "Agent",
    Customer = "Customer",
    Store = "Store"
}

export interface IActionAlertRuleActions {
    text: string,
    type: string,
    for: string
}

export const ActionAndAlertActionsDropDownList: IActionAlertRuleActions[] = [

    {
        text: ActionRule.NotifyCustomerviaSMS,
        for: ActionFor.Customer,
        type: ActionType.SMS
    },
    {
        text: ActionRule.NotifyCustomerviaEmail,
        for: ActionFor.Customer,
        type: ActionType.Email,
    },
    {
        text: ActionRule.AlertAgentviaSMS,
        for: ActionFor.Agent,
        type: ActionType.SMS
    },
    {
        text: ActionRule.AlertAgentviaEmail,
        for: ActionFor.Agent,
        type: ActionType.Email
    },
    {
        text: ActionRule.AlertAgentviaApplication,
        for: ActionFor.Agent,
        type: ActionType.Alert
    },
    {
        text: ActionRule.AddToGroup,
        for: ActionFor.Customer,
        type: ActionType.Group
    },
    {
        text: ActionRule.MovePosition,
        for: ActionFor.Customer,
        type: ActionType.Position
    },
    {
        text: ActionRule.HighLightTheVisit,
        for: ActionFor.Customer,
        type: ActionType.Color
    },
    {
        text: ActionRule.BCCStore,
        for: ActionFor.Store,
        type: ActionType.Email
    },
    {
        text: ActionRule.RouteTo,
        for: ActionFor.Customer,
        type: ActionType.Route
    },
    {
        text: ActionRule.AssignPriority,
        for: ActionFor.Customer,
        type: ActionType.Priority
    },
    {
        text: ActionRule.GenerateReportingEvent,
        for: ActionFor.Customer,
        type: ActionType.ReportingEventAName
    },
    {
        text: ActionRule.AddToQueue,
        for: ActionFor.Customer,
        type: ActionType.RouteToQueue
    },
    {
        text: ActionRule.GenerateMonitorAnnouncement,
        for: ActionFor.Customer,
        type: ActionType.Announcement,
    },
]

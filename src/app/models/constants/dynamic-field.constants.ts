export const DynamicFieldIds = {
    serviceNameId:"8794ae8b-2dd7-48cf-b5d3-95acba3add17",
    workflowNameId:"8794ae8b-2dd7-48cf-b5d3-95acba3add20",
    queueNameId:"65bf0d75-c63e-4dbc-89bb-02197d035f12",
    groupNameId:"0f1224b4-c301-4d95-a826-71c9297e8c91",
    locationNameId:"ad16b155-d300-4619-a402-c6b0731ffffd",
    supportedLanguageId:"10bea05c-a47e-49a1-a77f-6350cbe02245",
    companyNameId:"8794ae8b-2dd7-48cf-b5d3-95acba3add21",
    serviceTimeId:"fe9a1f79-638c-412b-b325-ebd42380cbee",
    waitTimeId:"624ac53a-2769-4f95-b978-5a91a25178d4"
    
}

export const TextDynamicFieldForDropdown = [
    {
        id:DynamicFieldIds.serviceNameId,
        name:'Service Name'
    },
    {
        id:DynamicFieldIds.workflowNameId,
        name : 'Workflow Name'
    },
    {
        id:DynamicFieldIds.queueNameId,
        name:'Queue Name'
    },
    {
        id:DynamicFieldIds.groupNameId,
        name:'Group Name'
    },
    {
        id:DynamicFieldIds.locationNameId,
        name:'Location Name'
    },
    {
        id:DynamicFieldIds.supportedLanguageId,
        name:'Selected Language'
    }
    //TODO:KEEP ==> need in future
    // {
    //     id:DynamicFieldIds.companyNameIds,
    //     name:'Company Name'
    // }
]

export const TimeInNumberDynamicField = [
    {
        id:DynamicFieldIds.serviceTimeId,
        name:'Service Time'
    },
    {
        id:DynamicFieldIds.waitTimeId,
        name : 'Wait Time'
    }
]

export const NumberTimeMagnitude = "Minutes"
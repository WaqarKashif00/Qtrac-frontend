
export const WorkflowValidationMessage = {
    TypeMessage: [
      { type: 'required', message: 'Please select value.' },
    ],
    workflowNameMessages: [
      {type: 'isExists', message: 'Workflow with same name already exists.' },
      {type: 'required', message: 'Please enter name.' },
    ],
    TemplateNameMessages: [
      {type: 'isExists', message: 'Template with same name already exists.' },
      {type: 'required', message: 'Please enter name.' },
    ],
    NameMessage: [
      { type: 'required', message: 'Please enter name' },
      { type: 'isExists', message: 'Name already exists.'}
    ],
    QuestionSetNameMessage: [
      { type: 'required', message: 'Please enter name' },
      { type: 'isExists', message: 'Question set with same name already exists.'}
    ],
    shortNameMessage: [
      { type: 'required', message: 'Please enter display name.' },
      { type: 'isExists', message: 'Name already exists.'}
    ],
    confirmationEmailSubjectMessage: [
      { type: 'required', message: 'Please enter confirmation email subject.' },
    ],
    confirmationEmailTemplateMessage: [
      { type: 'required', message: 'Please enter confirmation email template.' },
    ],
    EmailSubjectMessage: [
      { type: 'required', message: 'Please enter email subject.' },
    ],
    EmailTemplateMessage: [
      { type: 'required', message: 'Please enter email template.' },
    ],
    SMSTemplateMessage: [
      { type: 'required', message: 'Please enter SMS template.' },
    ],
    TemplateMessage: [
      { type: 'required', message: 'Please enter message template.' },
      { type: 'notTranslated', message: 'Please translate the template' },
    ],
    confirmationSMSTemplateMessage: [
      { type: 'required', message: 'Please enter confirmation SMS template.'},
    ],
    reminderSMSTemplateMessage: [
      { type: 'required', message: 'Please enter reminder SMS template.'},
    ],
    reminderTemplateMessage: [
      { type: 'required', message: 'Please enter reminder template.'},
    ],
    maxLengthMessage: [
      { type: 'required', message: 'Please enter maxlength.' },
      { type: 'pattern', message: 'Enter only number.' }
    ],
    minMessage: [
      { type: 'required', message: 'Please enter min.' }
    ],
    optionsMessage: [
      { type: 'required', message: 'Please add options.' }
    ],
    maxMessage: [
      { type: 'required', message: 'Please enter max.' },
      { type: 'maxLengthShouldGreaterThenMinLength', message: 'Max should be greater then Min.'  }
    ],
    questionMessage: [
      { type: 'required', message: 'Please enter question.' },
    ],
    optionItemMessages: [
      { type: 'required', message: 'Please enter item.' },
    ],
    queueNameMessage: [
      { type: 'required', message: 'Please enter queue name.' },
      { type: 'isExists', message: 'Queue with same name already exists.' },
    ],
    averageWaitTimeMessage: [
      { type: 'required', message: 'Please enter average waiting time.' },
      { type: 'pattern', message: 'Enter only number.' },
    ],
    noOfPeopleInTimeSlotMessage: [
      { type: 'required', message: 'Please enter no. of people in time slot.' },
      { type: 'pattern', message: 'Enter only number.' },
    ],
    durationOfEachTimeSlotInMinutesMessage: [
      { type: 'required', message: 'Please enter duration of each time slot.' },
      { type: 'pattern', message: 'Enter only number.' },
    ],
    bookInAdvanceDaysMessage: [
      { type: 'required', message: 'Please enter book in advance.' },
      { type: 'pattern', message: 'Enter only number.' },
    ],
    bookInBeforeDaysMessage: [
      { type: 'required', message: 'Please enter book in before.' },
      { type: 'pattern', message: 'Enter only number.' },
    ],
    earlyCheckInMinutesMessage: [
      { type: 'required', message: 'Please enter early check in.' },
      { type: 'pattern', message: 'Enter only number.' },
    ],
    lateCheckInMinutesMessage: [
      { type: 'required', message: 'Please enter late check in.' },
      { type: 'pattern', message: 'Enter only number.' },
    ],
    ticketNumberFormatMessage: [
      { type: 'required', message: 'Please enter ticket number format.' },
    ],
    preFixNumberingFormatMessage: [
      { type: 'required', message: 'Please enter prefix ticket number format.' },
    ],
    postFixNumberingFormatMessage: [
      { type: 'required', message: 'Please enter postfix ticket number format.' },
    ],
    ConditionNameMessage: [
      { type: 'required', message: 'Please enter condition name.' },
    ],
    ConditionArrayMessage: [
      { type: 'required', message: 'Please add conditions.' },
    ],
    ServiceNameMessage: [
      { type: 'required', message: 'Please enter service name.' },
    ],
    GroupNameMessage: [
      { type: 'required', message: 'Please enter visitor tag name.' },
    ],
    DescriptionMessage: [
      { type: 'required', message: 'Please enter description.' },
      {type: 'isExists', message: 'Item with same description already exists.' },
    ],
    AppointmentTemlpateMessges: [
      { type: 'required', message: 'Please select template.' },
    ],
    TimeMessages: [
      {type: 'required', message: 'Please select time.'}
    ],
    ShortMessages: {
      TimeMessages: [
        {type: 'required', message: 'Enter min.'}
      ],
    },
    TimeSelectMessages: [
      {type: 'required', message: 'Select time.'}
    ],
    AnyDropdownMessages: [
      {
        type: 'required', message: 'Select any one.'
      }
    ],
    prefixMessage: [
      { type: 'required', message: 'Please enter prefix.' },
    ],
    postfixMessage: [
      { type: 'required', message: 'Please enter postfix.' },
    ],
    EventNameMessages: [
      {type: 'required', message: 'Please enter event name.'},
      {type: 'isExists', message: 'Event with same name already exists.' },
    ],
    RouteNameMessages: [
      {type: 'required', message: 'Please enter route name.'},
      {type: 'isExists', message: 'Route with same name already exists.' },
    ],
    DropdownValueMessages: [
      {type: 'required',  message: 'Please select value.'}
    ],
    TextValueMessage: [
      {type: 'required',  message: 'Please enter value.'}
    ],
    PhoneMessages: [
      { type: 'required', message: 'Phone number is required.' },
      { type: 'pattern', message: 'Phone number is invalid.' }
    ],
    EmailMessages: [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: ' Email is invalid.' }
    ],
    NumberMessages: [
      { type: 'required', message: 'value is required.' },
      { type: 'pattern', message: 'Please enter number only.' }
    ],

    EventConditionTypeMessage: [
      {type: 'required', message: 'Please select match type.'}
    ],
    QuestionSetMessages: [
      {type: 'required', message: 'Please select question set.'}
    ],
    RoutingMessages: [
      {type: 'required', message: 'Please select routing.'}
    ],
    SendViaMessages: [
      {type: 'required', message: 'Please select messaging type.'}
    ],
    ActionArrayMessages: [
      {type: 'required', message: 'Please add action'}
    ],
    ActionMessages: [
      {type: 'required', message: 'Please select action'}
    ],
    ColorMessages: [
      {type: 'required', message: 'Please select highlight color.'}
    ],
    GroupDropDownMessage: [
      {type: 'required', message: 'Please select visitor tag.'}
    ],
    PositionMessage: [
      {type: 'required', message: 'Please enter position number.'}
    ],
    RoleMessage: [
      {type: 'required', message: 'Please select role.'}
    ],
    AlertMessages: [
      {type: 'required', message: 'Please enter alert message.'}
    ],
    ReportingEventaname: [
      {type: 'required', message: 'Please enter reporting event name.'}
    ],    
    RouteToQueue: [
      {type: 'required', message: 'Please select route to queue.'}
    ],
    Required: [
      {type: 'required', message: 'Required'}
    ]
  };

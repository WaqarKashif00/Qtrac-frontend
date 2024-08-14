export const AgentConfigurationMessages = {
  TemplateNameMessages: [
    { type: 'required', message: 'Template name is required.' },
    { type: 'isExists', message: 'Template with same name already exists.'}
  ],
  UrlMessages: [
    { type: 'required', message: 'Url is required.' },
    { type: 'pattern', message: 'Please enter valid url.' },
  ],
  WorkflowMessages: [
    { type: 'required', message: 'Workflow is required.' },
  ],
  AgentViewMessages: [
    { type: 'required', message: 'Agent view is required.' },
  ],
  TimeFormatMessages: [
    { type: 'required', message: 'Time format is required.' },
  ],
  TimeInQueueMessages: [
    { type: 'required', message: 'Time in queue is required.' },
  ],
  TabNameMessages:[
    { type: 'required', message: 'Tab name is required.' },
  ]
  
};

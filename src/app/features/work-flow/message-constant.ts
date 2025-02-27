import { CommonMessages } from 'src/app/models/constants/message-constant';


export const WorkflowMessages = {
  EditQuestionAlreadyInUseMessage: 'Question is already in use in conditions you cant edit it.',
  DeleteQuestionAlreadyInUseMessage: 'Question is already in use in conditions you cant delete it.',
  QueueWithCustomerMessage: 'Visitors are in queue.',
  QueueAlreadyInUseOfServiceMessage: 'Queue is already in used by service.',
  QuestionSetAlreadyInUseByAdvanceRule:'Question set is already use by advance rule',
  QueueAlreadyInUseOfGlobalQuestionMessage: 'Queue is already in used by global question.',
  QueueAlreadyInUseOfQuestionSetMessage: 'Queue is already in used by service question.',
  QueueAlreadyInUseOfConditionalEventMessage: 'Queue is already in used by conditional event.',
  QuestionSetsAlreadyInUseMessageByService: 'Question set is already in used by service.',
  QuestionSetsAlreadyInUseMessageByQuestionSet: 'Question set is already in use by another question set.',
  AlreadyInUseMessageByAnother: ' is already in used by another .',
  QuestionSetAlreadyUse:' Question set is already  in used by  advance rule',
  QueueAlreadyInUseByAdvanceRule:'Queue is already  in used by  advance rule ',
  Question : 'Question',
  ConditionalEvent: 'Event',
  StartTicketNumberIsGreaterErrorMessage: 'Starting ticket number cannot be greater than ending ticket number',
  DefaultSelectActionMessage: 'Select action',
  AddActionMessage: 'Please add action',
  SingleQueueEnableQueueMessage: `Can't delete queue, single queue is enabled for company.`,
  AddSMSTemplateMessage: 'workflow validation : Please add template in basic communications.',
  AlreadyExistActionTypeMessage: 'This action type is already exists',
  SelectActionMessage: 'Please select action',
  SelectRoutingMessage: 'Please select routing',
  SelectColorMessage: 'Please select color',
  SameQuestionSetErrorMessage: 'Routing to same questionset',
  AlreadyExistActionMessage: 'This action is already exists',
  AppointmentAndWalkinsMessage: 'Appt and walkins',
  AppointmentOnlyMessage: 'Appointment only',
  AppointmentNameAlreadyExistMessage: 'Appointment name already exist',
  WalkinsOnlyMessage: 'Walkins only',
  CopyPostFixMessage: ' - Copy',
  SaveDraftMessage: 'Workflow drafted.',
  SavePublishMessage: 'Workflow published.',
  AddSingleNumberingRulesErrorMessage: 'Workflow Validation :\n\n Please add single numbering rules. \n',
  AddPersonMovementErrorMessage: 'Workflow Validation :\n\n Start ticket number should be greater than end ticket number. \n',
  AddServicesErrorMessage: `Workflow Validation :\n\n Please add services. \n`,
  AddQuestionSetErrorMessage: `Workflow Validation :\n\n Please add questionset. \n`,
  AddQueuesErrorMessage: `Workflow Validation :\n\n Please add queue. \n`,
  AddPreServiceQuestionsErrorMessage: 'Workflow Validation :\n\n Please add general questions. \n',
  ServicesMissingRoutingErrorMessage: `Workflow Validation :\n\n Some of the services are missing the routing`,
  QuestionSetMissingQuestionsErrorMessage: `Workflow Validation :\n\n Some of the question sets are missing the questions`,
  QuestionSetMissingConditionRoutingsErrorMessage: `Workflow Validation :\n\n Some of the question sets are missing the routing`,
  ConditionRoutingMissingActionErrorMessage: `Workflow Validation :\n\n Some of the conditionRoutings are missing the routing action. \n`,
  ConfirmDeleteMessage: CommonMessages.ConfirmDeleteMessage ,
  ConfirmCopyMessage: 'Are you sure you want to create copy of this item?',
  NoRoutingSpecifiedMessage: 'No routing specified',
  ShortNameAlreadyExistMessage: 'Short name already exists.',
  ServiceNameAlreadyExistMessage: 'Service name already exists.',
  QueueNameAlreadyExistMessage: 'Queue name already exists',
  ConditionNameAlreadyExistMessage: 'Condition name already exists',
  WorkflowNameAlreadyExistMessage: 'Workflow with same name already exists.',
  valueGreaterThanZeroMessage : 'value must be number greater than 0.',
  workflowNameMessage : 'Please enter workflow name.',
  ServiceUseByBranch: 'Service is in use by branch'
};




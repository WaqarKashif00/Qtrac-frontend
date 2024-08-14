export let Urls = [
  {
    url: '/login',
    methodName: 'Authenticate',
    serviceName: 'MockLoginLogics',
  },
  {
    url: '/servererror',
    methodName: 'ServerError',
    serviceName: 'MockLoginLogics',
  },
  {
    url: '/company-configuration',
    methodName: 'GetCompanyConfigInfo',
    serviceName: 'MockCompanyConfigurationLogics'
  },
  {
    url: '/country',
    methodName: 'GetCountryList',
    serviceName: 'MockCompanyConfigurationLogics'
  },
  {
    url : '/state',
    methodName : 'GetStateList',
    serviceName: 'MockCompanyConfigurationLogics'
  },
  {
    url : '/city',
    methodName : 'GetCityList',
    serviceName: 'MockCompanyConfigurationLogics'
  },
  {
    url : '/language',
    methodName : 'GetDefaultandOtherLanguauges',
    serviceName: 'MockCompanyConfigurationLogics'
  },
  {
    url : '/encryption',
    methodName : 'GetEncryptionList',
    serviceName: 'MockCompanyConfigurationLogics'
  },
  {
    url : '/time',
    methodName : 'GetTime',
    serviceName: 'MockCompanyConfigurationLogics'
  },
  {
    url : '/loginmode',
    methodName : 'GetLoginMode',
    serviceName: 'MockCompanyConfigurationLogics'
  },
  {
    url : '/save',
    methodName : 'SaveCompanyConfiguration',
    serviceName: 'MockCompanyConfigurationLogics'
  },
  {
    url : '/savenewbranch',
    methodName : 'SaveNewBranch',
    serviceName: 'MockAddNewBranchLogics'
  },
  {
    url : '/countries',
    methodName : 'GetCountries',
    serviceName: 'MockAddNewBranchLogics'
  },
  {
    url : '/languages',
    methodName : 'GetLanguages',
    serviceName: 'MockAddNewBranchLogics'
  },
  {
    url : '/states',
    methodName : 'GetStates',
    serviceName: 'MockAddNewBranchLogics'
  },
  {
    url : '/template',
    methodName : 'LayoutTemplate',
    serviceName: 'MockAddNewBranchLogics'
  },
  {
    url : '/agent-workflow',
    methodName : 'GetWorkFlowList',
    serviceName: 'MockAgentConfigurationLogics'
  },
  {
    url : '/agent-time-format',
    methodName : 'GetTimeFormat',
    serviceName: 'MockAgentConfigurationLogics'
  },
  {
    url : '/agent-view-type',
    methodName : 'GetAgentViewType',
    serviceName: 'MockAgentConfigurationLogics'
  },
  {
    url: '/time-in-queue',
    methodName: 'GetTimeDisplayInQueue',
    serviceName: 'MockAgentConfigurationLogics'
  },
  {
    url : '/agent-workflow',
    methodName : 'GetWorkFlowList',
    serviceName: 'MockAgentConfigurationLogics'
  },
  {
    url : '/agent-time-format',
    methodName : 'GetTimeFormat',
    serviceName: 'MockAgentConfigurationLogics'
  },
  {
    url : '/agent-view-type',
    methodName : 'GetAgentViewType',
    serviceName: 'MockAgentConfigurationLogics'
  },
  {
    url: '/time-in-queue',
    methodName: 'GetTimeDisplayInQueue',
    serviceName: 'MockAgentConfigurationLogics'
  },
  {
    url: '/login/email',
    methodName: 'CheckEmailExistOrNot',
    serviceName: 'MockLoginLogics'
  }
];

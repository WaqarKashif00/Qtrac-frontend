import { IAgentClassicConfiguration } from './classic-agent-configuration.interface';
import { IAgentGeneralConfiguration } from './general-agent-configuration.interface';
import { IAgentLiteConfiguration } from './lite-agent-configuration.interface';

export interface IAgentConfiguration{
  generalConfiguration: IAgentGeneralConfiguration;
  classicConfiguration?: IAgentClassicConfiguration;
  liteConfiguration?: IAgentLiteConfiguration;
}

import { IAgentDropdown } from 'src/app/models/common/agent-dropdown.interface';
import { IAgentQueue } from './agent-queue.interface';

export interface IAgentView {
  templateCode?: string;
  templateName: string;
  queues: IAgentQueue[];
}

export interface IAgentViewForm {
  isOverride: boolean;
  agentName: IAgentDropdown;
  queues: IAgentQueue[];
}

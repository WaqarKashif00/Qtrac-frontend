import { MockLoginLogic } from './login/mock-login.logic';
import { MockCompanyConfigurationLogic } from './company-configuration/mock-company-configuration.logic';
import { MockAddNewBranchLogic } from './branch/mock-add-new-branch.logic';
import { MockAgentConfigurationLogic } from './agent-configuration/mock-agent-configuration.logic';

// tslint:disable-next-line: no-namespace
export namespace MockLogic {
    export let MockLoginLogics = MockLoginLogic;
    export let MockCompanyConfigurationLogics = MockCompanyConfigurationLogic;
    export let MockAddNewBranchLogics = MockAddNewBranchLogic;
    export let MockAgentConfigurationLogics = MockAgentConfigurationLogic;

}

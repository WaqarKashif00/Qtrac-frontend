import { BaseMockLogic } from '../base-mock.logic';
import { HttpResponse } from '@angular/common/http';
import { IDropdownList } from 'src/app/models/common/dropdown-list.interface';

export class MockAgentConfigurationLogic extends BaseMockLogic{

  public GetWorkFlowList(): HttpResponse<IDropdownList[]>{
    return new HttpResponse<IDropdownList[]>
    ({
      status: 200,
      body: [
            { value: 'W001', text: 'General Workflow'},
            { value: 'W002', text: 'Early morning Workflow'},
            { value: 'W003', text: 'FrontDoor Workflow'}
          ]
    });
  }

public GetTimeFormat(){
  return new HttpResponse<IDropdownList[]>({
   status: 200,
   body: [
     {value: 'Military', text: 'Military'},
   {value: 'Regular', text: 'Regular'}
    ]
  });
}

public GetAgentViewType(){
  return new HttpResponse<IDropdownList[]>({
   status: 200,
   body: [
     {value: 'Classic', text: 'Classic'},
   {value: 'Lite', text: 'Lite'}
    ]
  });
}

public GetTimeDisplayInQueue(){
  return new HttpResponse<IDropdownList[]>({
   status: 200,
   body: [
     {value: 'T001', text: 'Waiting Time'},
   {value: 'T002', text: 'Actual Time'}
    ]
  });
}

public SaveAgentConfiguration(){
  return new HttpResponse<boolean>({
    status: 200,
    body: true
});
}


}

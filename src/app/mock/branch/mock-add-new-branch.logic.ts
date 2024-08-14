import { BaseMockLogic } from '../base-mock.logic';
import { HttpResponse } from '@angular/common/http';
import { IDropdownList } from 'src/app/features/branch-list/models/dropdown-list.interface';

// tslint:disable-next-line:no-namespace
export class MockAddNewBranchLogic extends BaseMockLogic {

  public GetCountries(): HttpResponse<IDropdownList[]>{
    return new HttpResponse<IDropdownList[]>
    ({
      status: 200,
      body: [
            { value: 'country1', text: 'United States'},
            { value: 'country2', text: 'Canada'},
            { value: 'country3', text: 'Mexico'}
          ]
    });
  }

  public GetStates(): HttpResponse<Array<IDropdownList>>{
  return  new HttpResponse<IDropdownList[]>({
        status: 200,
        body : [
          { value : 'state1', text: 'Washington', isSelected: 'country1' },
          { value : 'state2', text: 'California', isSelected: 'country1' },
          { value : 'state3', text: 'Virginia', isSelected: 'country1' },
          { value : 'state4', text: 'Alberta', isSelected: 'country2' },
          { value : 'state5', text: 'Nova Scortia', isSelected: 'country2' },
          { value : 'state6', text: 'Sinaloa', isSelected: 'country3' },
          { value : 'state7', text: 'Morelos', isSelected: 'country3' },
          { value : 'state8', text: 'Puebla', isSelected: 'country3' },
        ]
  });
}

public GetLanguauges(){
  return new HttpResponse<IDropdownList[]>({
   status: 200,
   body: [
      {value: 'lang1', text: 'Spanish'},
      {value: 'lang2', text: 'Japanese'},
      {value: 'lang3', text: 'Portuguese'},
      {value: 'lang4', text: 'French'},
      {value: 'lang5', text: 'German'}
    ]
  });
}

public SaveNewBranch(){
  return new HttpResponse<boolean>({
    status: 200,
    body: true
});
}

public LayoutTemplate(){
  return new HttpResponse<boolean>({
    status: 200,
    body: true
});
}

}

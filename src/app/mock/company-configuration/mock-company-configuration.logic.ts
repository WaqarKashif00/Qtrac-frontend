import { HttpResponse } from '@angular/common/http';
import { ICompanyConfiguration } from 'src/app/features/company-configuration/models/company-configuration.interface';
import { IDropdown } from 'src/app/features/company-configuration/models/dropdownlist.interface';
import { ILanguageDropdownList } from 'src/app/models/common/language-dropdownlist.interface';
import { BaseMockLogic } from '../base-mock.logic';

export class MockCompanyConfigurationLogic extends BaseMockLogic{

  public GetCompanyConfigInfo(): HttpResponse<ICompanyConfiguration> {
    return new HttpResponse<ICompanyConfiguration>
    ({
      status : 200,
      body: null
        // {companyConfigurationInfo : {
        //   name: 'Aron',
        //   id: 'company1',
        //   billingAddress : '221B Baker street',
        //   city: 'Cold Lake',
        //   state: {value : 'state4' , text: 'Alberta'},
        //   defaultLanguage : {value: 'defaultlang2', text : 'German'},
        //   zip: 91105,
        //   companyImg: 'assets/img/search_gray.png',
        //   phoneNumber: '2365214552',
        //   country: {value : 'country2', text: 'Canada'},
        //   supportedLanguage: [{value : 'lang2', text : 'Japanese'}, {value : 'lang3', text: 'Portuguese'}]
        // },
        // companyCommunicationInfo : {
        //   smtpServer: 'smtp.server.com',
        //   port: 500,
        //   encryption: {value : 'encry1', text : 'SSL'},
        //   userName : 'aron@gmail.com',
        //   password : 'QTVR1234',
        //   smsTotalNumber : 10,
        //   smsAssignedNumber: 6,
        //   smsUnassignedNumber: 4
        // },
        // companyAdvanceSettingInfo : {
        //   purgeTime : 5,
        //   purgeTimeInterval: {value: '0', text: 'Hours'},
        //   applicationTimeout : 60,
        //   applicationTimeInterval : {value: '1', text: 'Minutes'},
        //   adminTimeout : 60,
        //   adminTimeInterval : {value: '1', text: 'Minutes'},
        //   logoutUrl : 'https://www.abcbank.com/logout',
        //   loginMode: {value: 'mode1', text: 'Internal Authentication'},
        // }}

    });


  }

  public GetCountryList(): HttpResponse<IDropdown[]>{
    return new HttpResponse<IDropdown[]>
    ({
      status: 200,
      body: [
            { value: 'country1', text: 'United States'},
            { value: 'country2', text: 'Canada'},
            { value: 'country3', text: 'Mexico'}
          ]
    });
  }

  public GetStateList(): HttpResponse<Array<IDropdown>>{
  return  new HttpResponse<IDropdown[]>({
        status: 200,
        body : [
          { value : 'state1', text: 'Washington', selected: 'country1' },
          { value : 'state2', text: 'California', selected: 'country1' },
          { value : 'state3', text: 'Virginia', selected: 'country1' },
          { value : 'state4', text: 'Alberta', selected: 'country2' },
          { value : 'state5', text: 'Nova Scortia', selected: 'country2' },
          { value : 'state6', text: 'Sinaloa', selected: 'country3' },
          { value : 'state7', text: 'Morelos', selected: 'country3' },
          { value : 'state8', text: 'Puebla', selected: 'country3' },
        ]
  });
}

 public GetCityList(){
   return new HttpResponse<IDropdown[]>({
     status : 200,
     body : [
       {value : 'city1', text: 'Grand Coulee', selected: 'state1'},
       {value : 'city2', text: 'Seattle', selected: 'state1'},
       {value : 'city3', text: 'Foster City', selected: 'state2'},
       {value : 'city4', text: 'Los Angeles', selected: 'state2'},
       {value : 'city5', text: 'Emporia', selected: 'state3'},
       {value : 'city6', text: 'Hampton', selected: 'state3'},
       {value : 'city7', text: 'Cold Lake', selected: 'state4'},
       {value : 'city8', text: 'Sydney', selected: 'state5'},
       {value : 'city9', text: 'La Cruz', selected: 'state6'},

    ]
   });
 }

public GetDefaultandOtherLanguauges(){
  return new HttpResponse<ILanguageDropdownList>({
   status: 200,
   body: null
  //  {
  //   defaultLanguages : null, //[
  //   //   {value: 'defaultlang1', text: 'French'},
  //   //   {value: 'defaultlang2', text: 'German'}
  //   // ],
  //   supportedLanguages: [
  //     {value: 'lang1', text: 'Spanish'},
  //     {value: 'lang2', text: 'Japanese'},
  //     {value: 'lang3', text: 'Portuguese'},
  //     {value: 'lang4', text: 'French'},
  //     {value: 'lang5', text: 'German'}
  //   ]
  //  }
  });
}

public GetEncryptionList(){
  return new HttpResponse<IDropdown[]>({
   status: 200,
   body: [{value: 'ssl', text: 'SSL'}, {value : 'sha', text: 'SHA'}, {value: 'rsa', text: 'RSA'}
    ]
  });
}

public GetTime(){
  return new HttpResponse<IDropdown[]>({
   status: 200,
   body: [{value: '0', text: 'Hours'}, {value: '1', text: 'Minutes'}, {value: '2', text: 'Seconds'}
    ]
  });
}

public GetLoginMode(){
  return new HttpResponse<IDropdown[]>({
   status: 200,
   body: [{value: 'internal', text: 'Internal Authentication'}
    ]
  });
}

public SaveCompanyConfiguration(){
  return new HttpResponse<boolean>({
    status: 200,
    body: true
});
}


}

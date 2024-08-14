import { Injectable } from '@angular/core'; 

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {

constructor() { }

  getQtracLogo(){
    return './assets/img/Qtrac-Logo-Powered-By-Grey.png';
  }

}

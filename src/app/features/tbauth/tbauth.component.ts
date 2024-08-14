import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { RouteHandlerService } from 'src/app/core/services/route-handler.service';
import { TokenService } from 'src/app/core/services/token.service';

@Component({
  selector: 'lavi-tbauth',
  templateUrl: './tbauth.component.html',
  styleUrls: ['./tbauth.component.scss']
})
export class TbauthComponent extends AbstractComponentService  {
   constructor(
    public activatedRoute: ActivatedRoute,
    public routeHandlerService: RouteHandlerService,
    public tokenService: TokenService) {
    super();
   }
  ngOnInit(): void {
    
    this.subs.sink = this.activatedRoute.params.subscribe(async params => {
      console.log(params);
      const tokenObj = { 
        access_token : params.tokenId,
        expires_in:86400,
        expires_on: 1675763519,
        id_token:params.tokenId,
        id_token_expires_in:86400,
        not_before:1675677119,
        profile_info:"abc"
        ,refresh_token:"abc"
        ,refresh_token_expires_in:86400,
        resource:"a0ca5ec9-aafa-4c03-9617-6ded16616497",
        scope: "a0ca5ec9-aafa-4c03-9617-6ded16616497 offline_access openid",
        token_type:"Bearer"
      };
      this.tokenService.PersistAuthTokenAndUpdateStateVariables(tokenObj);
       this.routeHandlerService.RedirectToHome();
    });
  }

}

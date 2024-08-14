import { IAuthorizationDetails } from "src/app/models/common/authorization-details.model";
import { MenuOperationEnum } from "src/app/models/enums/menu-operation.enum";

interface MenuOptionArgs{
    hideEdit?:boolean ;
    hideDelete?:boolean ;
    hideDuplicate?:boolean ;
}

export function ShowMenuItem(item: any , authorizationDetails: IAuthorizationDetails, viewName:string){
    let showItem = false;
    if(authorizationDetails){
        const roleAccessView = authorizationDetails.roleActions.find(x => x.viewName == viewName);

      if (!authorizationDetails?.isAllSystemAccessible && roleAccessView) {
        switch (item.text) {
          case '...':
            showItem = (roleAccessView?.addEdit || roleAccessView?.delete);
            break
          case MenuOperationEnum.Edit:
            showItem = roleAccessView?.addEdit;
            break;
          case MenuOperationEnum.Delete:
            showItem = roleAccessView?.delete;
            break;
          case MenuOperationEnum.Duplicate:
            showItem = roleAccessView?.addEdit;
            break;
        }
      }
      if (authorizationDetails?.isAllSystemAccessible) {
        showItem = true;
      }
    }
    
    return showItem;
}

export function Menus(optionArgs?:MenuOptionArgs){
    let Menus: any[] = [
        {
          text: '...',
          items: [],
        },
      ];

    let Items = []  
    if(!optionArgs?.hideEdit){
        Items.push({text: MenuOperationEnum.Edit})
    }
    
    if(!optionArgs?.hideDelete){
        Items.push({text: MenuOperationEnum.Delete})
    }

    if(!optionArgs?.hideDuplicate){
        Items.push({text: MenuOperationEnum.Duplicate})
    }
    Menus[0].items = Items;
    return Menus;
}
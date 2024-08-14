import { Pipe } from '@angular/core';
import { cloneObject } from '../../../../../core/utilities/core-utilities';

@Pipe({name: 'controlPosition',pure:false})
export class ControlPositionPipe {
   transform(styles): any {
       return  cloneObject({x: styles.left, y: styles.top});
   }
}

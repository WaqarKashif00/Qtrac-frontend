import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'uniqueFilter',
    pure: false
})
export class UniqueFilterPipe implements PipeTransform {
    transform(items: any[], propName: string): any {
        if (!items || !propName) {
            return items;
        }

        return items.filter((v,i,a)=>a.findIndex(t=>(t[propName]===v[propName]))===i);
    }
}

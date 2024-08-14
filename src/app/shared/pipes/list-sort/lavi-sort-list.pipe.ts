import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'laviSortBy'
})
export class LaviSortByPipe implements PipeTransform {
    transform(items: any[], ...args: any[]): any[] {
        if (items && items.length > 1 && args) {
            //
            const orderByType = args[1] || 'asc';
            let objectName, objectPropertyName = '';
            // propName is name of the property of the item by which the sort will happen
            const propName = args[0] || '0';
            const nestedObject = propName.split('.');
            if ((propName.split('.')).length > 1){
            objectName = nestedObject[0];
            objectPropertyName = nestedObject[1];
            return items.sort((a, b) => {
                if ((a[objectName] && a[objectName][objectPropertyName]) && (b[objectName] && b[objectName][objectPropertyName])){
                const aLC: any = a[objectName][objectPropertyName];
                const bLC: any = b[objectName][objectPropertyName];

                return orderByType === 'asc'
                    ? (aLC < bLC ? -1 : (aLC > bLC ? 1 : 0))
                    : (aLC > bLC ? -1 : (aLC < bLC ? 1 : 0));
                }
            });
            }else{
            return items.sort((a, b) => {
                if (a[propName] && b[propName]){
                const aLC: any = a[propName];
                const bLC: any = b[propName];

                return orderByType === 'asc'
                    ? (aLC < bLC ? -1 : (aLC > bLC ? 1 : 0))
                    : (aLC > bLC ? -1 : (aLC < bLC ? 1 : 0));
                }
            });
        }
        }
        else {
            return items;
        }
    }
}

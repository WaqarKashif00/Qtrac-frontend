import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'dynamicBoldText'
})
export class DynamicBoldTextPipe implements PipeTransform {

  constructor(
    private sanitizer: DomSanitizer
  ) {}

  transform(value: string): any {
    return this.sanitize(this.replace(value));
  }

  replace(str) {
    return str?.replace(new RegExp('%(.*?)%', 'gi'), '<b>%$1%</b>');
  }

  sanitize(str) {
    return this.sanitizer.sanitize(SecurityContext.HTML, str);
  }
}

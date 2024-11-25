import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'sanitize',
    standalone: true
})
export class SanitizeTranformPipe implements PipeTransform {
  private _sanitizer: DomSanitizer = inject(DomSanitizer);
  constructor() {}

  transform(value: any): any {
    return this._sanitizer.bypassSecurityTrustHtml(value);
  }
}

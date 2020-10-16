import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[cellTemplate]',
})
export class CellTemplateDirective {
  @Input('cellTemplate') public name: string;

  constructor(public template: TemplateRef<any>) {}
}

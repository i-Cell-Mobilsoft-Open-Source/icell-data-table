import { Component, OnInit, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CellTemplateDirective } from '../directives/cell-template.directive';
import { get as _get } from 'lodash-es';

/**
 * Cella templéteket tartalmazó gyüjtő komponens.
 *
```xml
<cell-templates></cell-templates>
```
 *
 */
@Component({
  selector: 'cell-templates',
  templateUrl: './cell-templates.component.html',
})
export class CellTemplatesComponent implements OnInit {
  @ViewChildren(CellTemplateDirective) templates: QueryList<CellTemplateDirective>;

  constructor(public translate: TranslateService) {}

  ngOnInit(): void {}

  /**
   * @returns The specified template.
   * @param templateName specific template to be returned.
   */
  public getTemplate(templateName: string): TemplateRef<any> {
    return this.templates.toArray().find((x) => x.name.toLowerCase() === templateName.toLowerCase()).template;
  }

  getFieldData(rowData: any, fieldPath: string) {
    return _get(rowData, fieldPath);
  }

  /**
   * @returns Internationalized number.
   * @param value Input.
   */
  asNumeric(value) {
    return Intl.NumberFormat(this.translate.currentLang).format(parseFloat(value));
  }
}

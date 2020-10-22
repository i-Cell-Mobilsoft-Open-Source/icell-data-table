import { Component, OnInit, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { get as _get, isFunction as _isFunction, isString as _isString } from 'lodash-es';
import { CellTemplateDirective } from '../directives/cell-template.directive';
import { DataTableColumnDefinition } from '../interfaces';

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

  getFieldData(rowData: any, colDef: DataTableColumnDefinition) {
    if (!colDef) {
      return '';
    }

    if (_isFunction(colDef.valueGetter)) {
      return colDef.valueGetter(rowData);
    }

    let fieldData = '';

    if (_isString(colDef.field)) {
      fieldData = _get(rowData, colDef.field) ?? '';
    }

    if (_isFunction(colDef.valueFormatter)) {
      fieldData = colDef.valueFormatter(fieldData);
    }

    return fieldData;
  }

  /**
   * @returns Internationalized number.
   * @param value Input.
   */
  asNumeric(value) {
    return Intl.NumberFormat(this.translate.currentLang).format(parseFloat(value));
  }
}

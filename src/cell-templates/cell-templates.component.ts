import { Component, OnInit, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { get as _get, isFunction as _isFunction, isString as _isString } from 'lodash-es';
import { InputsType } from 'ng-dynamic-component';
import { CellTemplateDirective } from '../directives/cell-template.directive';
import { DataTableColumnDefinition } from '../interfaces';

/**
 * Collection of built-in cell templates.
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
      return colDef.valueGetter(rowData).toString();
    }

    let fieldData = '';

    if (_isString(colDef.field)) {
      fieldData = _get(rowData, colDef.field) ?? '';
    }

    if (_isFunction(colDef.valueFormatter)) {
      fieldData = colDef.valueFormatter(fieldData);
    }

    return fieldData.toString();
  }

  /**
   * @returns Internationalized number.
   * @param value Input.
   */
  asNumeric(value) {
    return Intl.NumberFormat(this.translate.currentLang).format(parseFloat(value));
  }

  /**
   * Assemble input bindings for `ndcDynamicInputs`
   *
   * @param rowData Current row's data
   * @param colDef Cell's colun definition
   * @internal
   */
  getComponentInputs(rowData: any, colDef: DataTableColumnDefinition): InputsType {
    return {
      data: rowData,
      parent: colDef.parent,
      ...colDef.componentOptions?.inputs,
    };
  }
}
